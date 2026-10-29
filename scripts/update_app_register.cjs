const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

const targetRegex = /onRegister=\{async \(email, password, name, phone, preferredPickupPoint, marketingConsent\) => \{[\s\S]*?showToast\('Đăng ký tài khoản Buyer thành công!'\);[\r\n\s]+return \{ success: true \};[\r\n\s]+\}[\r\n\s]+\}\}/;

const replacement = `onRegister={async (payload) => {
          const targetRole = payload.role === 'supplier' ? 'supplier' : 'buyer'; // STRICTLY NO ADMIN
          if (isSupabaseConfigured && !useLocalDemoMode) {
            // Supabase register
            const result = await authService.signUp(payload);
            if (result.error || !result.user) {
              return { success: false, error: result.error || 'Đăng ký không thành công.' };
            }
            localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(result.user));
            setCurrentUser(result.user);
            if (result.user.role === 'supplier') {
              setSupplierTab('dashboard');
              navigate('/');
              showToast('Đăng ký tài khoản Nhà cung cấp thành công! Chào mừng bạn đến với FlashGroup.');
            } else {
              setBuyerTab('discovery');
              navigate('/marketplace');
              showToast('Đăng ký tài khoản Người mua thành công! Hãy bắt đầu khám phá phòng gom.');
            }
            return { success: true };
          } else {
            // Local demo fallback
            const duplicate = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
            if (duplicate) {
              return { success: false, error: 'Email này đã được sử dụng.' };
            }
            const newUserId = \`\${targetRole}-\${Date.now()}\`;
            const newUser: User = {
              id: newUserId,
              name: payload.name,
              email: payload.email,
              password: payload.password,
              role: targetRole, // strictly buyer or supplier
              phone: payload.phone,
              preferredPickupPoint: payload.preferredPickupPoint,
              status: 'active' as const,
              createdAt: new Date().toISOString(),
            };
            setUsers((prev) => [...prev, newUser]);

            if (targetRole === 'supplier') {
              const newSupplierRecord: Supplier = {
                id: \`sup-\${Date.now()}\`,
                userId: newUserId,
                businessName: payload.businessName || payload.name,
                supplierType: (payload.businessType as any) || 'local_retailer',
                verificationStatus: 'pending',
                phone: payload.phone,
              };
              setSuppliers((prev) => [...prev, newSupplierRecord]);
              localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(newUser));
              setCurrentUser(newUser);
              setSupplierTab('dashboard');
              navigate('/');
              showToast('Đăng ký tài khoản Nhà cung cấp thành công! Vui lòng hoàn thiện hồ sơ xác minh để đăng bán.');
            } else {
              localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(newUser));
              setCurrentUser(newUser);
              setBuyerTab('discovery');
              navigate('/marketplace');
              showToast('Đăng ký tài khoản Người mua thành công! Hãy bắt đầu khám phá phòng gom.');
            }
            return { success: true };
          }
        }}`;

if (targetRegex.test(content)) {
  content = content.replace(targetRegex, replacement);
  console.log('Successfully replaced onRegister in App.tsx');
  fs.writeFileSync(appPath, content, 'utf8');
} else {
  console.error('targetRegex did not match in App.tsx');
}
