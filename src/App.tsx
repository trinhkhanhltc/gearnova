import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminGuard } from './components/admin/AdminGuard'
import { AdminLayout } from './components/admin/AdminLayout'
import { CustomerLayout } from './components/customer/CustomerLayout'
import { CartProvider } from './contexts/CartContext'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { AdminProfilePage } from './pages/admin/AdminProfilePage'
import { CustomersPage } from './pages/admin/CustomersPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { OrdersPage } from './pages/admin/OrdersPage'
import { PostFormPage } from './pages/admin/PostFormPage'
import { PostsPage } from './pages/admin/PostsPage'
import { ProductDetailPage as AdminProductDetailPage } from './pages/admin/ProductDetailPage'
import { ProductsPage } from './pages/admin/ProductsPage'
import { RevenuePage } from './pages/admin/RevenuePage'
import { SettingsPage } from './pages/admin/SettingsPage'
import { AccountSettingsPage } from './pages/customer/AccountSettingsPage'
import { ArticleDetailPage } from './pages/customer/ArticleDetailPage'
import { ArticlesPage } from './pages/customer/ArticlesPage'
import { CartPage } from './pages/customer/CartPage'
import { CheckoutPage } from './pages/customer/CheckoutPage'
import { HomePage } from './pages/customer/HomePage'
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage'
import { PaymentSuccessPage } from './pages/customer/PaymentSuccessPage'
import { ProductDetailPage as CustomerProductDetailPage } from './pages/customer/ProductDetailPage'
import { ProductListPage } from './pages/customer/ProductListPage'
import { PromotionsPage } from './pages/customer/PromotionsPage'
import { QrTransferPage } from './pages/customer/QrTransferPage'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:id" element={<CustomerProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/:id" element={<ArticleDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/qr-transfer" element={<QrTransferPage />} />
          <Route path="checkout/success" element={<PaymentSuccessPage />} />
          <Route path="orders/:id/tracking" element={<OrderTrackingPage />} />
          <Route path="account" element={<AccountSettingsPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<AdminProductDetailPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/new" element={<PostFormPage />} />
          <Route path="posts/:id" element={<PostFormPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  )
}

export default App
