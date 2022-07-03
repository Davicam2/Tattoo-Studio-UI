

export interface Ibooking{
    nameFirst: string,
    nameLast: string,
    tattooDesc: string,
    tattooPlacement: string,
    email: string,
    phoneNumber: string,
    submissionDate: Date,
    requestedDate: Date,
    startDate: Date,
    endDate: Date,
    id: string,
    ageCheck: boolean,
    isTest: boolean,
    status: string,
    allDay: boolean
    depositAmount: number,
    depositPaid?: boolean,
    cost?: number
}

export interface IReservation{
    start: Date,
    end: Date,
    allDay: boolean,
    title: string,
    id:string,
    view?: any
}