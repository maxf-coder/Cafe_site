import type { PageSection } from "@/types/api";
import type { WideImageContent, TightImageContent, VideoContent, ReelsContent } from "@/types/api";
import WideImageSection from "./WideImageSection";
import TightImageGrid from "./TightImageGrid";
import VideoSection from "./VideoSection";
import ReelsCarousel from "./ReelsCarousel";

export default function SectionRenderer({ sections }: { sections: PageSection[]}) {
    return sections.map((section) => {
        switch(section.type) {
            case "wide_image":
                return <WideImageSection key={section.id} content={section.content as WideImageContent} />;
            case "tight_image":
                return <TightImageGrid key={section.id} content={section.content as TightImageContent} />;
            case "video":
                return <VideoSection key={section.id} content={section.content as VideoContent} />;
            case "reels":
                return <ReelsCarousel key={section.id} content={section.content as ReelsContent} />;
        }
    });
}
