import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { buildHomeAlternateMetadata } from "@/lib/generateHomeMetadata";

type RootPageProps = {
  searchParams: Promise<{
    city?: string | string[];
    meteoSegreto?: string | string[];
    preview?: string | string[];
  }>;
};

export const generateMetadata = async ({
  searchParams,
}: RootPageProps): Promise<Metadata> =>
  buildHomeAlternateMetadata({ searchParamsPromise: searchParams });

const Page = ({ searchParams }: RootPageProps) => (
  <HomePage searchParams={searchParams} />
);

export default Page;
