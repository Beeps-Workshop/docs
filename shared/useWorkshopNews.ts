import {usePluginData} from '@docusaurus/useGlobalData';
import type {WorkshopNews} from './news';

const NO_NEWS: WorkshopNews = {latest: [], tags: []};

/**
 * The blog summary from the news plugin (shared/news.ts). Only the main instance runs that plugin; on
 * a project instance this returns no posts and no tags.
 */
export function useWorkshopNews(): WorkshopNews {
  // NEWS_PLUGIN in news.ts; not imported, since that module is Node-only (fs) and this one is bundled.
  return (usePluginData('workshop-news') as WorkshopNews | undefined) ?? NO_NEWS;
}
