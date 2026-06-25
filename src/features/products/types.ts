export type ProductCategory = {
  id: string;
  name: string;
  slug?: string;
};

export type Product = {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  price: number | string;
  imageUrl?: string;
  images?: string[];
  category?: ProductCategory | string | null;
  categoryId?: string;
  categoryName?: string;
  stock?: number;
  isActive?: boolean;
  active?: boolean;
  status?: string;
};

export type ProductSort = "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";

export type ProductListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: ProductSort;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ProductListResult = {
  items: Product[];
  meta: PaginationMeta;
};

export type ProductsBackendResponse =
  | Product[]
  | {
      data?: Product[] | { items?: Product[]; products?: Product[]; meta?: Partial<PaginationMeta> };
      items?: Product[];
      products?: Product[];
      meta?: Partial<PaginationMeta>;
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };

export type ProductDetailBackendResponse =
  | Product
  | {
      data?: Product;
      product?: Product;
    };

export type CategoriesBackendResponse =
  | ProductCategory[]
  | {
      data?: ProductCategory[] | { categories?: ProductCategory[] };
      categories?: ProductCategory[];
    };
