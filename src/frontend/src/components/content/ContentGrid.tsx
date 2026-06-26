import ContentCard from './ContentCard';
import type {Section} from "./ContentCard"

export default function ContentGrid({ sections }: { sections: Section[]}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        {sections.map((section) => (
          <ContentCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}