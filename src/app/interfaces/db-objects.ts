

export interface Ibooking{
    nameFirst: string,
    nameLast: string,
    tattooDesc: string,
    tattooPlacement: string,
    email: string,
    phoneNumber: string,
    submissionDate: Date,
    requestedDate: Date,
    requestedDateStart: Date,
    requestedDateEnd: Date,
    id: string,
    ageCheck: boolean,
    isTest: boolean,
    status: string,
    allDay: boolean
}

export interface IReservation{
    start: Date,
    end: Date,
    allDay: boolean,
    title: string,
    id:string,
    view?: any
}