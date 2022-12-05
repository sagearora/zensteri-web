import { gql, useSubscription } from "@apollo/client";
import React, { createContext, ReactNode, useContext } from "react";
import { auth } from "../firebase";
import Button from "../lib/Button";
import NotFoundItem from "../lib/NotFoundItem";
import { ClinicFragment, ClinicModel } from "../models/clinic.model";

export type DeviceMode = 'steri' | 'op'

const ClinicContext = createContext<{
    clinic: ClinicModel;
}>({} as any);

export type ProvideClinicProps = {
    LoadingScreen: ReactNode;
    children?: React.ReactNode
}

const SubscriptionClinic = gql`
    subscription clinic {
        clinic {
            ${ClinicFragment}
        }
    }
`;

export const ProvideClinic = ({
    children,
    LoadingScreen
}: ProvideClinicProps) => {
    const { data, loading } = useSubscription(SubscriptionClinic);
    const clinics = (data?.clinic || []) as ClinicModel[];

    const signout = () => auth.signOut();

    if (loading) {
        return <>{LoadingScreen}</>
    }

    if (clinics.length === 0) {
        return <div className="container py-6">
            <NotFoundItem title='Clinic not found' noBack />
            <Button onClick={signout}>Sign Out</Button>
        </div>;
    }

    const clinic = clinics[0];
    return <ClinicContext.Provider value={{
        clinic,
    }}>
        {children}
    </ClinicContext.Provider>
}

export const useClinic = () => {
    return useContext(ClinicContext);
}