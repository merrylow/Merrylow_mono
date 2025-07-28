// interface User {
//      id: string;
//      name: string;
//      email: string;
//      imgUrl: string;
//      // other properties
// }

// type UserState = {
//      user: User | null;
//      fetchUser: () => void;
//      isAuthenticated: boolean;
//      setAuthenticated: (isAuthenticated: boolean) => void;
//      loading: boolean;
// }

// type CardDetails = {
//      imgSrc: string
//      name: string
//      // description: string
// }

// interface Restaurant {
//      name: string;
//      id: string;
//      imageUrl: string;
//      phone: string;
//      location: string;
//      startTime: string;
//      endTime: string;
//      available: boolean;
//      products: [];
// }

// interface Product {
//      name: string;
//      id: string;
//      // images: { src: string }[];
//      restaurant: Restaurant;
//      // description: string;
//      imageUrl: string;
//      price: string;
//      alt: string;
//      addOns: Addon;
// }


// interface MenuItem {
//      name: string;
//      imageUrl?: string;
// }

// interface OrderItem {
//      menu?: MenuItem;
// }

// interface Order {
//      id: string;
//      address: string;
//      customerName: string;
//      customerPhone: string;
//      createdAt: string;
//      paymentMethod: string;
//      orderItems: OrderItem[];
//      status: string;
//      totalPrice: string;
// }


// type PackageAddOns = Record<string, number>;
// type OptionalAddOns = Record<string, number>;
// type CompulsoryAddOns = Record<string, number>; // { name: number }

// interface Addon {
//      package: PackageAddOns;
//      optional: OptionalAddOns;
//      compulsory: CompulsoryAddOns;
// }


// type SelectedAddon = {
//      package: PackageAddOns;
//      optional: OptionalAddOns;
//      compulsory: CompulsoryAddOns;
// }

// type SelectedAddons = {
//      package: string;
//      compulsory: string;
//      optional: string[];
// }


// type SavedProductSelections = {
//      addons: SelectedAddons;
//      quantity: number;
//      orderNote: string;
// }

// interface CartItem extends Product {
//      // order_status: string;
//      description?: string;
//      cartId?: string;
//      createdAt?: string;
//      quantity: number;
//      productId: string;
//      unitPrice?: string;
//      totalPrice?: string;
//      menu?: {
//           id: string;
//           name: string;
//           price: number;
//           imageUrl?: string;
//           addOns?: {
//                package?: Record<string, string | number>;
//                compulsory?: Record<string, string | number>;
//                optional?: Record<string, string | number>;
//           }
//           restaurantId?: string;
//      };
//      selectedAddons?: SelectedAddons | null;
//      orderNote: string | null;
// }

// type CartStore = {
//      loading: boolean;
//      error: boolean;
//      cart: CartItem[] | [];
//      initializeCart: () => void;
//      cartCount: number;
//      cartSubTotal: number;
//      cartTotal: number;
//      deliveryFee: number;
//      fetchCart: () => void;
//      addToCart: (product: Product, quantity: number, selectedAddons: SelectedAddons | null, orderNote: string | null) => Promise<boolean>
//      removeFromCart: (productId: string) => Promise<void>
//      clearCart: () => Promise<void>
//      updateCartCount: () => void;
//      calculateCartTotals: () => void;
//      calculateItemTotal: (product: Product, quantity: number, selectedAddons: SelectedAddons | null) => number;
//      paymentMethod: PaymentMethod
//      setPaymentMethod: (method: PaymentMethod) => void;
// }

// type PaymentMethod = string;

// type ProductStore = {
//      products: Product[];
//      restaurants: Restaurant[];
//      loading: boolean;
//      error: string | null;
//      currentProduct: Product | null;

//      fetchProducts: () => Promise<void>;
//      fetchRestaurants: () => Promise<void>;
//      // fetchProduct: (id: string) => Promise<void>
//      // fetchProduct: ;
//      favouriteProducts: Product[] | undefined;
//      favouriteRestaurants: Restaurant[] | undefined;
//      isProductFavourited: (product: Product | undefined) => boolean;
//      isRestaurantFavourited: (product: Restaurant | undefined) => boolean;
//      toggleFavouriteProduct: (product: Product | undefined) => void;
//      toggleFavouriteRestaurant: (restaurant: Restaurant | undefined) => void;

// }


// type OrderStore = {
//      loading: boolean;
//      error: boolean;
//      orders: Order[] | [];
//      fetchOrders: () => void;
//      formatOrderDate: (dateString: string) => string
// }


// export type { CardDetails, Restaurant, Product, CartItem, PaymentMethod, CartStore, ProductStore, SelectedAddons, User, UserState, Addon, Order, SavedProductSelections, OrderStore, OrderItem, MenuItem }