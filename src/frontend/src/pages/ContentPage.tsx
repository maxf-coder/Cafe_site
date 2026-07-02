import { fetchContentPage } from "@/api/contentPages";
import Hero from "@/components/shared/Hero";
import Loader from "@/components/shared/Loader";
import ErrorState from "@/components/shared/ErrorState";
import { useI18n } from "@/i18n/context";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SectionRenderer from "@/components/content/SectionRenderer";

export default function ContentPage() {
    const { slug } = useParams<{ slug: string }>()
    const { lang, t } = useI18n()

    const { data: page, isLoading, isError, refetch } = useQuery({
        queryKey: ["page", slug, lang],
        queryFn: () => fetchContentPage(slug!),
        enabled: !!slug,
    })

    if (isLoading) return <Loader />

    if (isError) return (
        <ErrorState message={t('error.page')} onRetry={() => refetch()} />
    )

    return (
        <>
            {page?.name && <title>{page.name} | Fiesta Gastro Cafe</title>}
            <div>
                {(page?.hero || false) && <Hero heroData={page.hero}/>}
                <SectionRenderer sections={page?.sections || []} />
            </div>
        </>
    )
}
