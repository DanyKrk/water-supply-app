package eu.waterlineproject.app.supply.water.application.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class DateUtil {
    static SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy", new Locale("pl", "PL"));
    static SimpleDateFormat secondDateFormat = new SimpleDateFormat("dd-MMM-yyyy", new Locale("pl", "PL"));
    static SimpleDateFormat secondDateFormatEng = new SimpleDateFormat("dd-MMM-yyyy", new Locale("en", "US"));

    public static boolean isNumeric(String str) {
        return str.matches("-?\\d+(\\.\\d+)?");
    }

    public static Date setDate(String dateString) throws ParseException {
        dateString = dateString.replace("/", "-");
        dateString = dateString.replace(".", "-");
        String[] elements = dateString.split("-");
        Date date;
        if (elements[1].length() == 2) {
            date = dateFormat.parse(dateString);
        } else {
            try {
                date = secondDateFormat.parse(dateString);
            } catch (ParseException e) {
                date = secondDateFormatEng.parse(dateString);
            }
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.setTimeZone(TimeZone.getTimeZone(java.time.ZoneId.systemDefault()));
        return calendar.getTime();
    }

    public static Date toDate(OffsetDateTime offsetDateTime) {
        return Date.from(offsetDateTime.toInstant().atZone(offsetDateTime.getOffset()).toInstant());
    }

    public static Date now() {
        return Date.from(OffsetDateTime.now().toInstant().atZone(OffsetDateTime.now().getOffset()).toInstant());
    }
}
