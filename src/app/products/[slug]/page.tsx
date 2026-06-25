import { ProductDetail } from "@/features/products/components/product-detail";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  return <ProductDetail slugOrId={slug} />;
}
