export interface IAppConfig extends IUserProfile, ITooltips, IEnvironment, IModalConfig, IStripeConfig, IAppVariables{
    URIS:{
        BASE:{
            express: string;
            express_dev: string;
            express_prod: string;
        },
        ENDPOINTS:{
            BOOKING:{
                getBookedDates: string,
                requestBooking: string,
                getBookings: string,
                acceptBooking: string,
                rejectBooking: string,
                reserveBookingDate: string,
                getBooking: string,
                getSecureBookings: string,
                getBookingImages: string,
                cancelBooking: string,
                updateProperty: string
            },
            USER:{
                checkUserLogin: string,
            },
            RESERVATION:{
                requestReservedDate: string,
                getReservationList: string,
                deleteReservation: string
            },
            STRIPE:{
                requestPayment: string
            }
            
        }
    },
    
    BOOKINGTABLE:{
        headers:[{key:string,value:string}],
        showButtons: boolean
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

export interface IModalConfig {
    MODAL_CONFIGS:{
        BOOKING_FORM_SUCCESS:{
            title: string;
            message: string;
        },
        BOOKING_FORM_FAILURE: {
            title: string;
            message:string;
        },
        LOGIN:{
            title: string;
            message: string;
        },
        INSPECT_BOOKING:{
            title: string;
            message: string;
        }
    }
}

export interface IStripeConfig{
    STRIPE_SETTINGS:{
        publishable_key: string;
    }
    
}

export interface IAppVariables{
    UTILITY_SETTINGS:{
        http_timeout: number
    }
}