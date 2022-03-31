// Role type --> Main tabs --> Sub menu
let roles = {
    departmentCA: {
        Home: "/home",
        Dashboard: {
            Transport: "/dashboard/transport",
        },
    },
    ShiftIC: {
        Home: "/home",
        View: {
            Employess: "/employee-list",
            Casuals: "/casuals-list",
        },
        Dashboard: {
            Transport: "/dashboard/transport",
        },
        Profile: {
            Details: "/profile/details",
            "Change Password": "/profile/change-password",
            "Shift Schedule": "/profile/shift-schedule",
        },
        Attendance: {
            Casuals: "/attendance/casuals",
        },
    },
    HoDTA: {
        Home: "/home",
        View: {
            Employess: "/employee-list",
            Casuals: "/casuals-list",
        },
        Dashboard: "/dashboard",
        Profile: {
            Details: "/profile/details",
            "Change Password": "/profile/change-password",
            "Shift Schedule": "/profile/shift-schedule",
        },
        Attendance: {
            Casuals: "/attendance/casuals",
        },
        Admin: {
            "Shift Plan": "/admin/shift-plan",
        },
    },
    HoD: {
        Home: "/home",
        View: {
            Employess: "/employee-list",
            Casuals: "/casuals-list",
        },
        Dashboard: "/dashboard",
        Profile: {
            Details: "/profile/details",
            "Change Password": "/profile/change-password",
            "Shift Schedule": "/profile/shift-schedule",
        },
        Attendance: {
            Casuals: "/attendance/casuals",
        },
        Admin: {
            "Shift Plan": "/admin/shift-plan",
            "User Management": "/admin/user-management",
        },
        Contracts: {
            "All Contracts": "/contract",
            "New Contract": "/contract/new",
            "Edit Contract": "/contract/edit",
            "New Casual": "/contract/new-casual",
            "Edit Casual": "/contract/edit-casual",
        },
    },
    DPLAdmin: {
        Home: "/home",
        View: {
            Employess: "/employee-list",
            Casuals: "/casuals-list",
        },
        Dashboard: "/dashboard",
        Profile: {
            Details: "/profile/details",
            "Change Password": "/profile/change-password",
            "Shift Schedule": "/profile/shift-schedule",
        },
        Attendance: {
            Casuals: "/attendance/casuals",
        },
        Admin: {
            "Shift Plan": "/admin/shift-plan",
            "User Management": "/admin/user-management",
        },
        Contracts: {
            "All Contracts": "/contract",
            "New Contract": "/contract/new",
            "Edit Contract": "/contract/edit",
            "New Casual": "/contract/new-casual",
            "Edit Casual": "/contract/edit-casual",
        },
    },
};

module.exports = roles;
