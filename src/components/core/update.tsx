import { useLayoutEffect } from "react";
import { useApplicationInformation } from "src/wrapper/tauri";
import { useBannerManager } from "src/wrapper/banner";

import { check } from "@tauri-apps/plugin-updater";

const UpdateChecker = () => {
  const application = useApplicationInformation();
  const banners = useBannerManager();

  const queryUpdate = async () => {
    // Temporarily disabled to allow version 2.1.2 development
    console.log("[update] Update check disabled for development");
    return;

    /* 
    const result = await check();
    if (result == null) return console.log("[update] no update needed");

    console.log(
      `[update] ${result.version} from ${result.date} with notes ${result.body}`
    );

    application.setUpdateNeeded(result);

    banners.push({
      closable: false,
      colour: "blue",
      id: "update",
      text: `Version ${result.version} update available, click to navigate to the update page.`,
      link: "/update",
    });
    */
  };

  useLayoutEffect(() => {
    // Update check disabled
    // (async () => await queryUpdate())();
  }, []);

  return null;
};

export default UpdateChecker;
