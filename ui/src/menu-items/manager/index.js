import profile from '../admin/profile';
import myschedule from '../admin/myschedule';
// import role from '../admin/role';
import department from '../admin/department';
import out_of_office_day from '../admin/out-of-office-day';
import user from '../admin/user';
import zone from '../admin/zone';
import schedule from '../admin/schedule';
import calendar from '../admin/calendar';
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [profile, myschedule, department, out_of_office_day, zone, user, schedule, calendar]
};

export default menuItems;
