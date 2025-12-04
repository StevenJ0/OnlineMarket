import SearchView from "@/components/views/search/search-view";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SeachPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ?? "";

  return <SearchView query={query} />;
}
