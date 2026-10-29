const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Update handleLogout
const oldLogoutRegex = /\/\/ Logout \(Requirement 6\)[\r\n\s]+const handleLogout = \(\) => {[\r\n\s]+setCurrentUser\(null\);[\r\n\s]+setSelectedRoomId\(null\);[\r\n\s]+setCheckoutRoomId\(null\);[\r\n\s]+showToast\([^)]+\);[\r\n\s]+};/;

const newLogout = `// Logout (Requirement 6 & Production Auth Flow)
  const handleLogout = async () => {
    if (isSupabaseConfigured && !useLocalDemoMode) {
      try {
        await authService.signOut();
      } catch (err) {
        console.error('Supabase signOut error:', err);
      }
    }
    localStorage.removeItem('flashgroup_v3_current_user');
    setCurrentUser(null);
    setSelectedRoomId(null);
    setCheckoutRoomId(null);
    setBuyerTab('discovery');
    showToast('Đã đăng xuất phiên làm việc.');
  };`;

if (oldLogoutRegex.test(content)) {
  content = content.replace(oldLogoutRegex, newLogout);
  console.log('Successfully replaced handleLogout');
} else {
  console.log('oldLogoutRegex did not match');
}

// 2. Update AuthModalOrPage block
const oldAuthBlockRegex = /if \(!currentUser\) {[\r\n\s]+return \([\r\n\s]+<AuthModalOrPage[\s\S]*?\/>[\r\n\s]+\);[\r\n\s]+}/;

const newAuthBlock = `if (!currentUser) {
    return (
      <AuthModalOrPage
        isSupabaseMode={isSupabaseConfigured && !useLocalDemoMode}
        onLogin={async (email: string, password: string, rememberMe: boolean = true) => {
          if (isSupabaseConfigured && !useLocalDemoMode) {
            // Supabase auth
            const result = await authService.signIn(email, password);
            if (result.error || !result.user) {
              const rawErr = result.error || '';
              const friendlyErr = rawErr.toLowerCase().includes('invalid') || rawErr.toLowerCase().includes('credentials')
                ? 'Email hoặc mật khẩu chưa chính xác.'
                : rawErr.toLowerCase().includes('network')
                ? 'Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.'
                : rawErr || 'Đăng nhập không thành công.';
              return { success: false, error: friendlyErr };
            }
            if (rememberMe) {
              localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(result.user));
            } else {
              localStorage.removeItem('flashgroup_v3_current_user');
            }
            setCurrentUser(result.user);
            if (result.user.role === 'supplier') {
              setSupplierTab('dashboard');
              navigate('/');
            } else if (result.user.role === 'admin') {
              setAdminTab('overview');
              navigate('/');
            } else {
              setBuyerTab('discovery');
              navigate('/marketplace');
            }
            showToast(\`Đăng nhập thành công với vai trò \${result.user.role.toUpperCase()}!\`);
            return { success: true };
          } else {
            // Local demo fallback
            const found = users.find(
              (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
            );
            if (!found) {
              return { success: false, error: 'Email hoặc mật khẩu chưa chính xác.' };
            }
            if (rememberMe) {
              localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(found));
            } else {
              localStorage.removeItem('flashgroup_v3_current_user');
            }
            setCurrentUser(found);
            if (found.role === 'supplier') {
              setSupplierTab('dashboard');
              navigate('/');
            } else if (found.role === 'admin') {
              setAdminTab('overview');
              navigate('/');
            } else {
              setBuyerTab('discovery');
              navigate('/marketplace');
            }
            showToast(\`Đăng nhập thành công với vai trò \${found.role.toUpperCase()}!\`);
            return { success: true };
          }
        }}
        onRegister={async (email, password, name, phone, preferredPickupPoint, marketingConsent) => {
          if (isSupabaseConfigured && !useLocalDemoMode) {
            // Supabase register
            const result = await authService.signUp(email, password, name, phone, preferredPickupPoint);
            if (result.error || !result.user) {
              return { success: false, error: result.error || 'Đăng ký không thành công.' };
            }
            localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(result.user));
            setCurrentUser(result.user);
            setBuyerTab('discovery');
            navigate('/marketplace');
            showToast('Đăng ký tài khoản Buyer thành công!');
            return { success: true };
          } else {
            // Local demo fallback
            const duplicate = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
            if (duplicate) {
              return { success: false, error: 'Email này đã được đăng ký.' };
            }
            const newUser = {
              id: \`buyer-\${Date.now()}\`,
              name,
              email,
              password,
              role: 'buyer' as const,
              phone,
              preferredPickupPoint,
              status: 'active' as const,
              createdAt: new Date().toISOString(),
            };
            setUsers((prev) => [...prev, newUser]);
            localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(newUser));
            setCurrentUser(newUser);
            setBuyerTab('discovery');
            navigate('/marketplace');
            showToast('Đăng ký tài khoản Buyer thành công!');
            return { success: true };
          }
        }}
        onContinueAsGuestDemo={() => {
          const defaultBuyer = createInitialUsers()[0];
          setCurrentUser(defaultBuyer);
          setBuyerTab('discovery');
          navigate('/marketplace');
          showToast('Đã vào chế độ Demo với tài khoản Nguyễn Minh Anh!');
        }}
      />
    );
  }`;

if (oldAuthBlockRegex.test(content)) {
  content = content.replace(oldAuthBlockRegex, newAuthBlock);
  console.log('Successfully replaced AuthModalOrPage block');
} else {
  console.log('oldAuthBlockRegex did not match');
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('Finished updating App.tsx');
