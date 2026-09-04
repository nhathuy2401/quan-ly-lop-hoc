import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { AppProvider, useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { LoginModal } from '../components/auth/LoginModal';

// Mock firebaseService so tests don't make real network calls
vi.mock('../services/firebaseService', () => ({
  firebaseService: {
    getAuthInstance: vi.fn(() => null),
    getDbInstance: vi.fn(() => null),
    loginWithEmail: vi.fn(async (email: string) => ({
      success: true,
      user: {
        uid: 'fb-user-123',
        email: email,
        displayName: 'Giáo viên Test'
      }
    })),
    loginWithGoogle: vi.fn(async () => ({
      success: true,
      user: {
        uid: 'google-user-456',
        email: 'gvcn.google@gmail.com',
        displayName: 'Nguyễn Thị Mai (Google)'
      }
    })),
    logout: vi.fn(async () => {}),
    onAuthChanged: vi.fn(() => () => {})
  }
}));

const TestWrapper: React.FC = () => {
  return (
    <AppProvider>
      <Header />
    </AppProvider>
  );
};

describe('Authentication & Header State Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('TC-01: Khi chưa đăng nhập, Header hiển thị nút "Đăng nhập"', () => {
    render(<TestWrapper />);

    expect(screen.getByTestId('header-login-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('header-user-profile')).not.toBeInTheDocument();
  });

  it('TC-02: Đăng nhập nhanh vai trò GVCN -> Header hiển thị profile GVCN và huy hiệu [GVCN], ẩn nút Đăng nhập', async () => {
    const TestComponent = () => {
      const { loginUser } = useApp();
      return (
        <div>
          <Header />
          <button
            data-testid="login-gvcn-btn"
            onClick={() =>
              loginUser({
                uid: 'gvcn-1',
                email: 'gvcn@thpt.edu.vn',
                displayName: 'Cô Nguyễn Thị Mai',
                role: 'gvcn'
              })
            }
          >
            Mock Login GVCN
          </button>
        </div>
      );
    };

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('header-login-btn')).toBeInTheDocument();

    // Thực hiện đăng nhập GVCN
    fireEvent.click(screen.getByTestId('login-gvcn-btn'));

    // Header cập nhật:
    expect(screen.queryByTestId('header-login-btn')).not.toBeInTheDocument();

    const profileEl = screen.getByTestId('header-user-profile');
    expect(profileEl).toBeInTheDocument();
    expect(within(profileEl).getByText('Cô Nguyễn Thị Mai')).toBeInTheDocument();
    expect(within(profileEl).getByText('GVCN')).toBeInTheDocument();
    expect(within(profileEl).getByTitle('Chuyển vai trò / Đổi tài khoản')).toBeInTheDocument();
    expect(within(profileEl).getByTitle('Đăng xuất')).toBeInTheDocument();

    // Kiểm tra localStorage
    const saved = JSON.parse(localStorage.getItem('gvc_current_user') || '{}');
    expect(saved.role).toBe('gvcn');
    expect(saved.displayName).toBe('Cô Nguyễn Thị Mai');
  });

  it('TC-03: Đăng nhập nhanh vai trò Ban cán sự -> Header hiển thị huy hiệu [Cán sự]', async () => {
    const TestComponent = () => {
      const { loginUser } = useApp();
      return (
        <div>
          <Header />
          <button
            data-testid="login-bancansu-btn"
            onClick={() =>
              loginUser({
                uid: 'bancansu-1',
                email: 'bancansu@thpt.edu.vn',
                displayName: 'Nguyễn An Bình (Lớp trưởng)',
                role: 'bancansu'
              })
            }
          >
            Mock Login Cán sự
          </button>
        </div>
      );
    };

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    fireEvent.click(screen.getByTestId('login-bancansu-btn'));

    const profileEl = screen.getByTestId('header-user-profile');
    expect(within(profileEl).getByText('Nguyễn An Bình (Lớp trưởng)')).toBeInTheDocument();
    expect(within(profileEl).getByText('Cán sự')).toBeInTheDocument();
    expect(screen.queryByTestId('header-login-btn')).not.toBeInTheDocument();
  });

  it('TC-04: Đăng xuất -> Header lập tức chuyển về nút "Đăng nhập"', async () => {
    // Giả lập đã đăng nhập sẵn trong localStorage
    localStorage.setItem(
      'gvc_current_user',
      JSON.stringify({
        uid: 'gvcn-1',
        email: 'gvcn@thpt.edu.vn',
        displayName: 'Cô Nguyễn Thị Mai',
        role: 'gvcn'
      })
    );

    render(<TestWrapper />);

    const profileEl = screen.getByTestId('header-user-profile');
    expect(within(profileEl).getByText('Cô Nguyễn Thị Mai')).toBeInTheDocument();

    // Bấm nút Đăng xuất
    const logoutBtn = within(profileEl).getByTitle('Đăng xuất');
    fireEvent.click(logoutBtn);

    // Header quay về hiển thị nút "Đăng nhập"
    await waitFor(() => {
      expect(screen.getByTestId('header-login-btn')).toBeInTheDocument();
      expect(screen.queryByTestId('header-user-profile')).not.toBeInTheDocument();
      expect(localStorage.getItem('gvc_current_user')).toBeNull();
    });
  });

  it('TC-05: Khôi phục phiên làm việc (Hydration) từ localStorage khi F5/reload trang', () => {
    localStorage.setItem(
      'gvc_current_user',
      JSON.stringify({
        uid: 'stored-user-99',
        email: 'gvcn@thpt.edu.vn',
        displayName: 'Thầy Trần Văn Bảo',
        role: 'gvcn'
      })
    );

    render(<TestWrapper />);

    const profileEl = screen.getByTestId('header-user-profile');
    expect(within(profileEl).getByText('Thầy Trần Văn Bảo')).toBeInTheDocument();
    expect(within(profileEl).getByText('GVCN')).toBeInTheDocument();
    expect(screen.queryByTestId('header-login-btn')).not.toBeInTheDocument();
  });

  it('TC-06: Đăng nhập trực tiếp từ LoginModal với "Vào nhanh 1-chạm" vai trò GVCN', async () => {
    const ModalTest = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <AppProvider>
          <Header />
          <button data-testid="open-modal-btn" onClick={() => setOpen(true)}>
            Mở Modal
          </button>
          <LoginModal isOpen={open} onClose={() => setOpen(false)} />
        </AppProvider>
      );
    };

    render(<ModalTest />);

    // Mở modal
    fireEvent.click(screen.getByTestId('open-modal-btn'));

    // Chuyển sang vai trò GVCN trong modal
    const gvcnRoleCard = screen.getByText('Toàn quyền').closest('button');
    if (gvcnRoleCard) fireEvent.click(gvcnRoleCard);

    // Chuyển sang tab "Vào nhanh 1-chạm"
    const quickTabBtn = screen.getByRole('button', { name: /vào nhanh 1-chạm/i });
    fireEvent.click(quickTabBtn);

    // Bấm "Vào ngay với vai trò GVCN"
    const enterBtn = screen.getByRole('button', { name: /vào ngay với vai trò gvcn/i });
    fireEvent.click(enterBtn);

    // Header phải ngay lập tức hiển thị user và ẩn nút Đăng nhập
    await waitFor(() => {
      const profileEl = screen.getByTestId('header-user-profile');
      expect(within(profileEl).getByText('GVCN')).toBeInTheDocument();
      expect(screen.queryByTestId('header-login-btn')).not.toBeInTheDocument();
    });
  });

  it('TC-07: Chuyển đổi vai trò từ GVCN sang Cán sự qua setUserRole', async () => {
    const RoleSwitchTest = () => {
      const { setUserRole } = useApp();
      return (
        <div>
          <Header />
          <button data-testid="switch-to-officer" onClick={() => setUserRole('bancansu')}>
            Chuyển Cán sự
          </button>
        </div>
      );
    };

    localStorage.setItem(
      'gvc_current_user',
      JSON.stringify({
        uid: 'gvcn-1',
        email: 'gvcn@thpt.edu.vn',
        displayName: 'Cô Nguyễn Thị Mai',
        role: 'gvcn'
      })
    );

    render(
      <AppProvider>
        <RoleSwitchTest />
      </AppProvider>
    );

    const profileBefore = screen.getByTestId('header-user-profile');
    expect(within(profileBefore).getByText('GVCN')).toBeInTheDocument();

    // Chuyển sang cán sự
    fireEvent.click(screen.getByTestId('switch-to-officer'));

    await waitFor(() => {
      const profileAfter = screen.getByTestId('header-user-profile');
      expect(within(profileAfter).getByText('Cán sự')).toBeInTheDocument();
      expect(within(profileAfter).queryByText('GVCN')).not.toBeInTheDocument();
      const updated = JSON.parse(localStorage.getItem('gvc_current_user') || '{}');
      expect(updated.role).toBe('bancansu');
    });
  });

  it('TC-08: Đăng nhập Google từ LoginModal -> Header hiển thị tài khoản Google thành công', async () => {
    const ModalTest = () => {
      const [open, setOpen] = React.useState(true);
      return (
        <AppProvider>
          <Header />
          <LoginModal isOpen={open} onClose={() => setOpen(false)} />
        </AppProvider>
      );
    };

    render(<ModalTest />);

    const googleBtn = screen.getByRole('button', { name: /đăng nhập nhanh với google/i });
    fireEvent.click(googleBtn);

    await waitFor(() => {
      const profileEl = screen.getByTestId('header-user-profile');
      expect(within(profileEl).getByText('Nguyễn Thị Mai (Google)')).toBeInTheDocument();
      expect(within(profileEl).getByText('GVCN')).toBeInTheDocument();
      expect(screen.queryByTestId('header-login-btn')).not.toBeInTheDocument();
    });
  });

  it('TC-09: Khi Firebase gặp lỗi configuration-not-found -> bấm "Vào ngay (Nội bộ)" đăng nhập thành công', async () => {
    const { firebaseService } = await import('../services/firebaseService');
    (firebaseService.loginWithGoogle as any).mockResolvedValueOnce({
      success: false,
      message: 'Firebase: Error (auth/configuration-not-found).'
    });

    const ModalTest = () => {
      const [open, setOpen] = React.useState(true);
      return (
        <AppProvider>
          <Header />
          <LoginModal isOpen={open} onClose={() => setOpen(false)} />
        </AppProvider>
      );
    };

    render(<ModalTest />);

    // Bấm Google bị lỗi configuration-not-found
    const googleBtn = screen.getByRole('button', { name: /đăng nhập nhanh với google/i });
    fireEvent.click(googleBtn);

    // Xuất hiện cảnh báo và nút "Vào ngay (Nội bộ)"
    await waitFor(() => {
      expect(screen.getByText(/chưa bật tính năng đăng nhập Google/i)).toBeInTheDocument();
    });

    const fallbackBtn = screen.getByRole('button', { name: /vào ngay \(nội bộ\)/i });
    expect(fallbackBtn).toBeInTheDocument();

    // Bấm "Vào ngay (Nội bộ)"
    fireEvent.click(fallbackBtn);

    // Header phải ngay lập tức hiển thị user đăng nhập
    await waitFor(() => {
      const profileEl = screen.getByTestId('header-user-profile');
      expect(profileEl).toBeInTheDocument();
      expect(screen.queryByTestId('header-login-btn')).not.toBeInTheDocument();
    });
  });
});
