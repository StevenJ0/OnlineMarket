import DetailStoreView from "@/components/views/store/detail-store";

type Props = { params: Promise<{ id: string }> };

export default async function StoreDetailPage(props: Props) {
  const { id } = await props.params;

  return <DetailStoreView storeId={id} />;
}
