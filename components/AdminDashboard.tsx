
import React, { useEffect, useState } from 'react';
import { Package, Phone, Search, CheckCircle, XCircle, Clock, Truck, ArrowRight, LayoutDashboard, ShoppingBag, Plus, Trash2, Image as ImageIcon, Menu, X, FileSpreadsheet, Layers, Edit2, RefreshCw } from 'lucide-react';
import { Order, CaseColor, Product, Category } from '../types';
import { getOrders, updateOrderStatus } from '../services/orderService';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../services/productService';
import { getCategories, addCategory, deleteCategory } from '../services/categoryService';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories'>('orders');
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true for dev
  const [password, setPassword] = useState('');

  // Order State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Product State
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', originalPrice: '', image: '', description: '', category: '', images: '' });
  
  // Category State
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      loadProducts();
      loadCategories();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
        const data = await getOrders();
        setOrders(data);
    } catch (e) {
        console.error(e);
    }
    setLoadingOrders(false);
  };

  const loadProducts = async () => {
    try {
        setProducts(await getProducts());
    } catch (e) { console.error(e); }
  };

  const loadCategories = async () => {
    try {
        setCategories(await getCategories());
    } catch (e) { console.error(e); }
  };

  const handleStatusChange = async (id: string, newStatus: Order['status']) => {
    await updateOrderStatus(id, newStatus);
    loadOrders(); 
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const galleryImages = productForm.images
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

    try {
        const productData = {
            name: productForm.name,
            price: Number(productForm.price) || 0,
            originalPrice: Number(productForm.originalPrice) || undefined,
            image: productForm.image || './product-image.jpg',
            images: galleryImages, // Pass array directly, even if empty. Service handles cleanup.
            description: productForm.description,
            category: productForm.category
        };

        if (editingProduct) {
            // Update existing
            await updateProduct({
                ...editingProduct,
                ...productData
            });
            alert('تم تعديل المنتج بنجاح');
            setEditingProduct(null);
        } else {
            // Add new
            await addProduct(productData);
            alert('تمت إضافة المنتج بنجاح');
        }
        
        setProductForm({ name: '', price: '', originalPrice: '', image: '', description: '', category: '', images: '' });
        loadProducts();
    } catch (error) {
        console.error(error);
        alert('حدث خطأ أثناء الحفظ');
    }
  };

  const startEditProduct = (product: Product) => {
      setEditingProduct(product);
      setProductForm({
          name: product.name,
          price: product.price.toString(),
          originalPrice: product.originalPrice?.toString() || '',
          image: product.image,
          description: product.description,
          category: product.category || '',
          images: product.images ? product.images.join('\n') : ''
      });
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
      setEditingProduct(null);
      setProductForm({ name: '', price: '', originalPrice: '', image: '', description: '', category: '', images: '' });
  };

  const handleDeleteProduct = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling
    
    if(window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        try {
            await deleteProduct(id);
            await loadProducts(); // Wait for reload
        } catch (error) {
            console.error("Delete failed", error);
            alert("فشل حذف المنتج. تأكد من الصلاحيات.");
        }
    }
  };

  // --- Category Handlers ---
  const handleAddCategory = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCategoryName.trim()) return;
      await addCategory(newCategoryName);
      setNewCategoryName('');
      loadCategories();
  };

  const handleDeleteCategory = async (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if(window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
          await deleteCategory(id);
          loadCategories();
      }
  };

  const handleSeedCategories = async () => {
      if (categories.length > 0) {
          if (!window.confirm('لديك تصنيفات بالفعل. هل تريد إضافة التصنيفات الافتراضية أيضاً؟')) return;
      }
      
      const defaults = ['سماعات', 'ساعات ذكية', 'إكسسوارات', 'عروض حصرية'];
      try {
          await Promise.all(defaults.map(name => addCategory(name)));
          alert('تمت إضافة التصنيفات الافتراضية بنجاح');
          loadCategories();
      } catch (e) {
          console.error(e);
          alert('حدث خطأ أثناء الإضافة');
      }
  };

  const handleExportExcel = async () => {
    // Ensure we have latest data
    const ordersList = await getOrders();
    
    // CSV Headers
    const headers = [
        'رقم الطلب',
        'التاريخ',
        'العميل',
        'الهاتف',
        'المدينة',
        'العنوان',
        'المنتج',
        'لون الغطاء',
        'الثمن (DH)',
        'الحالة'
    ];

    // Map orders to CSV rows
    const rows = ordersList.map(order => {
        // Translate status for Excel
        let statusText: string = order.status;
        switch(order.status) {
            case 'new': statusText = 'جديد'; break;
            case 'confirmed': statusText = 'مؤكد'; break;
            case 'shipped': statusText = 'تم الشحن'; break;
            case 'delivered': statusText = 'تم التوصيل'; break;
            case 'cancelled': statusText = 'ملغي'; break;
        }

        return [
            order.id,
            new Date(order.createdAt).toLocaleDateString('en-GB'), // DD/MM/YYYY
            `"${order.fullName.replace(/"/g, '""')}"`, // Escape quotes
            `"${order.phoneNumber}"`, // Force string for phone
            `"${order.city}"`,
            `"${order.address.replace(/"/g, '""')}"`,
            'SonicPod Gen 4',
            order.selectedColor || 'Black',
            order.totalPrice || 190,
            statusText
        ].join(',');
    });

    // Combine headers and rows with BOM (\uFEFF) for Arabic support in Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hsmarket-orders-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { 
      setIsAuthenticated(true);
    } else {
      alert('كلمة المرور خاطئة');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = 
      order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phoneNumber.includes(searchTerm) ||
      order.id.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock className="w-3 h-3 ml-1" /> جديد</span>;
      case 'confirmed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><CheckCircle className="w-3 h-3 ml-1" /> مؤكد</span>;
      case 'shipped': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Truck className="w-3 h-3 ml-1" /> تم الشحن</span>;
      case 'delivered': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Package className="w-3 h-3 ml-1" /> تم التوصيل</span>;
      case 'cancelled': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 ml-1" /> ملغي</span>;
      default: return null;
    }
  };

  const getColorBadge = (color: CaseColor) => {
    const colors = {
        [CaseColor.RED]: 'bg-red-500',
        [CaseColor.BLACK]: 'bg-gray-800',
        [CaseColor.PINK]: 'bg-pink-400',
        [CaseColor.GREEN]: 'bg-green-500',
    }
    const selected = color || CaseColor.BLACK;
    return <div className={`w-4 h-4 rounded-full ${colors[selected]} shadow-sm inline-block align-middle ml-1`}></div>
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">تسجيل دخول المسؤول</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="أدخل كلمة المرور (admin123)"
              />
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">
              دخول
            </button>
            <button type="button" onClick={onBack} className="w-full text-gray-500 text-sm hover:underline">
              العودة للمتجر
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex" dir="rtl">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg text-gray-700"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-64 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-gray-100 justify-between md:justify-start">
             <img src="./logo.png" alt="HSMarket Logo" className="h-10 w-auto object-contain" />
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <LayoutDashboard className="w-5 h-5 ml-3" />
                إدارة الطلبات
            </button>
             <button 
                onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-colors ${activeTab === 'products' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <ShoppingBag className="w-5 h-5 ml-3" />
                إدارة المنتجات
            </button>
            <button 
                onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-colors ${activeTab === 'categories' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Layers className="w-5 h-5 ml-3" />
                التصنيفات
            </button>

            <div className="pt-4 mt-4 border-t border-gray-100">
                <button 
                    onClick={handleExportExcel}
                    className="w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                >
                    <FileSpreadsheet className="w-5 h-5 ml-3" />
                    تحميل الطلبات (Excel)
                </button>
            </div>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
            <button onClick={onBack} className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-sm font-bold transition-all">
                <ArrowRight className="w-4 h-4 ml-2" />
                الخروج للمتجر
            </button>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20 px-4 sm:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-black text-gray-900">
                {activeTab === 'orders' ? 'الطلبات الواردة' : activeTab === 'products' ? 'إدارة المنتجات' : 'تصنيفات المتجر'}
            </h1>
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-bold">A</div>
            </div>
        </header>

        <div className="p-4 sm:p-8">
            
            {/* --- ORDERS VIEW --- */}
            {activeTab === 'orders' && (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">مجموع الطلبات</p>
                        <p className="text-3xl font-black text-gray-900">{orders.length}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">الطلبات الجديدة</p>
                        <p className="text-3xl font-black text-blue-600">{orders.filter(o => o.status === 'new').length}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">الإيرادات (المتوقعة)</p>
                        <p className="text-3xl font-black text-green-600" dir="ltr">{orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.totalPrice || 190), 0)} <span className="text-lg text-gray-400">DH</span></p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">نسبة التسليم</p>
                        <p className="text-3xl font-black text-purple-600">
                            {orders.length > 0 ? Math.round((orders.filter(o => o.status === 'delivered').length / orders.length) * 100) : 0}%
                        </p>
                    </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                        type="text"
                        placeholder="بحث بالاسم، الهاتف..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {['all', 'new', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                            filter === status 
                                ? 'bg-gray-900 text-white shadow-md' 
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {status === 'all' ? 'الكل' : status === 'new' ? 'جديد' : status === 'confirmed' ? 'مؤكد' : status === 'shipped' ? 'مشحون' : status === 'delivered' ? 'مستلم' : 'ملغي'}
                        </button>
                        ))}
                    </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                            <th className="px-6 py-4 font-bold text-right">رقم الطلب</th>
                            <th className="px-6 py-4 font-bold text-right">العميل</th>
                            <th className="px-6 py-4 font-bold text-right">العنوان</th>
                            <th className="px-6 py-4 font-bold text-right">المنتج</th>
                            <th className="px-6 py-4 font-bold text-right">الحالة</th>
                            <th className="px-6 py-4 font-bold text-right">تحديث</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loadingOrders ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">جاري تحميل البيانات...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">لا توجد طلبات مطابقة</td></tr>
                            ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#{order.id}</span>
                                    <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('ar-MA')}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{order.fullName}</div>
                                    <div className="flex items-center text-sm text-gray-500 mt-1 dir-ltr justify-end gap-1">
                                        <span className="font-mono">{order.phoneNumber}</span>
                                        <Phone className="w-3 h-3" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{order.city}</div>
                                    <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">{order.address}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {getColorBadge(order.selectedColor)}
                                        <span className="mr-2 text-sm font-medium truncate max-w-[150px]">
                                            {orders.length > 0 ? 'منتج' : 'Gen 4'}
                                        </span>
                                    </div>
                                    <div className="text-xs font-bold text-amber-600 mt-1">{order.totalPrice || 190} DH</div>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(order.status)}
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                        className="text-sm border border-gray-200 rounded-lg bg-white py-1.5 px-2 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                                    >
                                        <option value="new">جديد</option>
                                        <option value="confirmed">تأكيد</option>
                                        <option value="shipped">شحن</option>
                                        <option value="delivered">تسليم</option>
                                        <option value="cancelled">إلغاء</option>
                                    </select>
                                </td>
                                </tr>
                            ))
                            )}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </>
            )}

            {/* --- PRODUCTS VIEW --- */}
            {activeTab === 'products' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Add/Edit Product Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    {editingProduct ? <Edit2 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-amber-600" />}
                                    {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                                </span>
                                {editingProduct && (
                                    <button onClick={cancelEdit} className="text-xs text-red-500 hover:underline">إلغاء</button>
                                )}
                            </h2>
                            <form onSubmit={handleProductSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                                    <input 
                                        required
                                        type="text"
                                        value={productForm.name}
                                        onChange={e => setProductForm({...productForm, name: e.target.value})}
                                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="مثلاً: سماعات Pro"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">الثمن (DH)</label>
                                        <input 
                                            required
                                            type="number"
                                            value={productForm.price}
                                            onChange={e => setProductForm({...productForm, price: e.target.value})}
                                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                            placeholder="199"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">الثمن السابق</label>
                                        <input 
                                            type="number"
                                            value={productForm.originalPrice}
                                            onChange={e => setProductForm({...productForm, originalPrice: e.target.value})}
                                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                            placeholder="300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                                    <select
                                        value={productForm.category}
                                        onChange={e => setProductForm({...productForm, category: e.target.value})}
                                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                                    >
                                        <option value="">اختر تصنيفاً...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Image Input Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة الرئيسية</label>
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            value={productForm.image}
                                            onChange={e => setProductForm({...productForm, image: e.target.value})}
                                            className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-left mb-2 text-xs"
                                            dir="ltr"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        <ImageIcon className="absolute right-3 top-3 text-gray-400 w-4 h-4" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">روابط صور المعرض (كل رابط في سطر)</label>
                                    <textarea 
                                        value={productForm.images}
                                        onChange={e => setProductForm({...productForm, images: e.target.value})}
                                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none h-24 resize-none text-left text-xs font-mono"
                                        dir="ltr"
                                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">وصف قصير</label>
                                    <textarea 
                                        value={productForm.description}
                                        onChange={e => setProductForm({...productForm, description: e.target.value})}
                                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none h-20 resize-none"
                                        placeholder="وصف مميزات المنتج..."
                                    />
                                </div>
                                <button type="submit" className={`w-full text-white py-3 rounded-xl font-bold transition-colors shadow-lg ${editingProduct ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-900 hover:bg-black'}`}>
                                    {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="lg:col-span-2 space-y-4">
                         {products.map(product => (
                             <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 group hover:border-amber-200 transition-colors">
                                 <div className="h-24 w-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                     <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                     {product.images && product.images.length > 0 && (
                                         <span className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 rounded-md">
                                             +{product.images.length}
                                         </span>
                                     )}
                                 </div>
                                 <div className="flex-1">
                                     <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                     <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                                     <div className="mt-2 flex items-center gap-3">
                                         <span className="bg-amber-50 text-amber-700 text-sm font-bold px-2 py-0.5 rounded-lg">
                                             {product.price} DH
                                         </span>
                                         {product.originalPrice && (
                                            <span className="text-gray-400 text-xs line-through">
                                                {product.originalPrice} DH
                                            </span>
                                         )}
                                         {product.category && (
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-lg">
                                                {categories.find(c => c.id === product.category)?.name || 'غير مصنف'}
                                            </span>
                                         )}
                                     </div>
                                 </div>
                                 <div className="flex flex-col gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => startEditProduct(product)}
                                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                        title="تعديل المنتج"
                                    >
                                        <Edit2 className="w-5 h-5 pointer-events-none" />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={(e) => handleDeleteProduct(product.id, e)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="حذف المنتج"
                                    >
                                        <Trash2 className="w-5 h-5 pointer-events-none" />
                                    </button>
                                 </div>
                             </div>
                         ))}

                         {products.length === 0 && (
                             <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                 <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                 <p className="text-gray-500 font-medium">لا توجد منتجات حالياً</p>
                             </div>
                         )}
                    </div>
                </div>
            )}

            {/* --- CATEGORIES VIEW --- */}
            {activeTab === 'categories' && (
                <div className="max-w-4xl mx-auto">
                    
                    {/* Add Category Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                         <h2 className="text-lg font-bold text-gray-900 mb-4">إضافة تصنيف جديد</h2>
                         <form onSubmit={handleAddCategory} className="flex gap-4 mb-6">
                             <input 
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="اسم التصنيف (مثلاً: سماعات)"
                                className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                required
                             />
                             <button type="submit" className="bg-gray-900 text-white px-6 rounded-xl font-bold hover:bg-black transition-colors">
                                 إضافة
                             </button>
                         </form>

                         {/* Seed Default Categories Button */}
                         <div className="border-t border-gray-100 pt-4">
                             <button 
                                onClick={handleSeedCategories}
                                className="flex items-center text-sm text-amber-600 hover:text-amber-700 font-medium hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors"
                             >
                                 <RefreshCw className="w-4 h-4 ml-2" />
                                 أضف التصنيفات الافتراضية (سماعات، ساعات، إكسسوارات)
                             </button>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(category => (
                            <div key={category.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group">
                                <span className="font-bold text-gray-800">{category.name}</span>
                                <button 
                                    type="button"
                                    onClick={(e) => handleDeleteCategory(category.id, e)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-5 h-5 pointer-events-none" />
                                </button>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                لا توجد تصنيفات، أضف واحداً الآن.
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
