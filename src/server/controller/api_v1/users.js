const {
  getPlace,
  getEvent,
  getVisitedPlaces,
  getFavoritesPlaces,
  getUsersPlaces,
  getUsersEvents,
  getScheduledEvents,
} = require('../../../db');

const {
  users: {
    ITEMS_IN_SECTION,
    section: { EVENT_ID, PLACE_ID },
  },
} = require('../../../config');

async function mainPage(ctx) {
  const { id: userId } = ctx.state.authPayload;

  const getSectionInfo = async (sectionFunction, sectionIdKey) => {
    const sectionResults = await sectionFunction(userId, ITEMS_IN_SECTION);

    const fullSectionResults = [];

    for await (const { [sectionIdKey]: sectionId } of sectionResults) {
      // 1
      // const section = await getGeneralInfo(sectionId);

      // 2
      let section;
      if (sectionIdKey === PLACE_ID) section = await getPlace(sectionId);
      else section = await getEvent(sectionId);

      fullSectionResults.push({
        id: sectionId,
        name: section.name,
        main_photo: section.main_photo,
      });
    }

    return fullSectionResults;
  };

  const response = {};

  response.visited_places = await getSectionInfo(getVisitedPlaces, PLACE_ID);
  response.favorites_places = await getSectionInfo(getFavoritesPlaces, PLACE_ID);
  response.user_places = await getSectionInfo(getUsersPlaces, PLACE_ID);
  response.user_events = await getSectionInfo(getUsersEvents, EVENT_ID);
  response.scheduled_events = await getSectionInfo(getScheduledEvents, EVENT_ID);

  ctx.body = response;
}

module.exports = { mainPage };
