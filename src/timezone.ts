import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export class Timezone {

    static initTimezone() {
        dayjs.extend(utc);
        dayjs.extend(timezone);
        dayjs.tz.setDefault("America/Los_Angeles");
    }
}
