export interface appConfig{
    URIS:{
        BASE:{
            express: string;
        }
    },
    USER_PROFILE:{
        userName: string,
        userID: string,
        userEmail: string,
        userRole: string,
        userRoleID: number,
        isSignedIn: boolean
    },
    TOOLTIPS:{
        BOOKING:{
            tattooDesc: string,
            tattooPlacement: string
        }
    }

}