export interface IAppConfig extends IUserProfile, ITooltips, IEnvironment{
    URIS:{
        BASE:{
            express: string;
        },
        ENDPOINTS:{
            getBookedDates: string,
            requestBooking: string,
            getBookings: string,
            acceptBooking: string,
            rejectBooking: string,
            checkUserLogin: string
        }
    },
    
    BOOKINGTABLE:{
        headers:[{key:string,value:string}]
    }
}

export interface IUserProfile{
    USER_PROFILE:{
        fName: string;
        lName: string;
        ID: string;
        email: string;
        phoneNum: string;
        role: string;
        roleID: number;
        userName: string;
        isSignedIn: boolean;
    }
}

export interface ITooltips{
    TOOLTIPS:{
        BOOKING:{
            tattooDesc: string;
            tattooPlacement: string;
            ageCheck: string;
        }
    }
}

export interface IEnvironment{
    ENVIRONMENTS:{
        dev: boolean,
        prod: boolean
    }
}