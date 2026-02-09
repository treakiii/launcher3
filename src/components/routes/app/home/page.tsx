import { useRetrac } from "src/wrapper/retrac";
import { useUserManager } from "src/wrapper/user";

import CharacterWidget from "src/components/routes/app/home/widgets/character";
import StatisticsWidget from "src/components/routes/app/home/widgets/statistics";
import FortniteWidget from "src/components/routes/app/home/widgets/fortnite";
import NewsWidget from "src/components/routes/app/home/widgets/news";
import EventsWidget from "src/components/routes/app/home/widgets/events";
import LootLabsWidget from "src/components/routes/app/home/widgets/lootlabs";
import DonateWidget from "src/components/routes/app/home/widgets/donate";
import NewsModalParent from "./widgets/news_modal";

const HomePage = () => {
  const retrac = useRetrac();
  const userManager = useUserManager();
  if (userManager._user == null || userManager._season == null) return null;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1400px] mx-auto w-full">
      <NewsModalParent />

      {/* Hero Section / Profile Overview */}
      <section className="flex flex-col @[1000px]:flex-row gap-4">
        <div className="flex-[1.5]">
          <CharacterWidget
            user={userManager._user}
            season={userManager._season}
          />
        </div>
        <div className="flex-1">
          <StatisticsWidget
            account={userManager._user.Account}
            season={userManager._season}
          />
        </div>
      </section>

      {/* Main Action Section */}
      <section className="grid grid-cols-1 @[1200px]:grid-cols-12 gap-4">
        <div className="@max-[1200px]:col-span-1 @[1200px]:col-span-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40 px-1">Play</h2>
            <FortniteWidget />
          </div>
        </div>
        <div className="@max-[1200px]:col-span-1 @[1200px]:col-span-4 h-full">
          <div className="flex flex-col gap-3 h-full">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40 px-1">Rewards</h2>
            <LootLabsWidget />
          </div>
        </div>
      </section>

      {/* Community & Updates */}
      <section className="grid grid-cols-1 @[1200px]:grid-cols-12 gap-4 mb-8">
        <div className="@max-[1200px]:col-span-1 @[1200px]:col-span-7">
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40 px-1">News</h2>
            <NewsWidget />
          </div>
        </div>

        {retrac.show_all_widgets && (
          <div className="@max-[1200px]:col-span-1 @[1200px]:col-span-5 flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40 px-1">Events</h2>
            <div className="flex flex-col gap-4">
              <EventsWidget />
              <DonateWidget />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};


export default HomePage;
