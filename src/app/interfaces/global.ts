export interface appConfig{
    URIS:{
        BASE:{
            express: string;
        }
    },
    USER_PROFILE:{
        fName: string,
        lName: string
        ID: string,
        email: string,
        phoneNum: string,
        role: string,
        roleID: number,
        isSignedIn: boolean
    },
    TOOLTIPS:{
        BOOKING:{
            tattooDesc: string,
            tattooPlacement: string
        }
    }

}