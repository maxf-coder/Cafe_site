import type { PageSection } from "@/types/api";
import type { WideImageContent, TightImageContent, VideoContent, ReelsContent } from "@/types/api";
import VideoSection from "./VideoSection";
import ReelsCarousel from "./ReelsCarousel";

export default function SectionRenderer({ sections }: { sections: PageSection[]}) {
    return sections.map((section) => {
        switch(section.type) {
            case "wide_image":
                return <WideImageSection content={section.content as WideImageContent} />
            case "tight_image":
                return <TightImageGrid content={section.content as TightImageContent} />
            case "video":
                return <VideoSection content={section.content as VideoContent} />
            case "reels":
                return <ReelsCarousel content={section.content as ReelsContent} />
        }
    });
}