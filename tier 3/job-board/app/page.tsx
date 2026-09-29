import HomeView from "@/components/home/HomeView";
import { getAllJobs, getCategories, getLocations } from "@/lib/jobs";

export default function Home() {
  const jobs = getAllJobs();
  const categories = getCategories();
  const locations = getLocations();
  const companyCount = new Set(jobs.map((j) => j.company)).size;

  const categoryCounts = categories.reduce<Record<string, number>>(
    (acc, cat) => {
      acc[cat] = jobs.filter((j) => j.category === cat).length;
      return acc;
    },
    {}
  );

  return (
    <main className="flex-1">
      <HomeView
        jobs={jobs}
        featuredJobs={jobs.slice(0, 6)}
        categories={categories}
        categoryCounts={categoryCounts}
        companyCount={companyCount}
        locationCount={locations.length}
      />
    </main>
  );
}
