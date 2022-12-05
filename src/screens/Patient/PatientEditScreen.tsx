import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../lib/BackButton";
import { useDialog } from "../../lib/dialog.context";
import Loading from "../../lib/Loading";
import NotFoundItem from "../../lib/NotFoundItem";
import { PatientFragment, PatientModel } from "../../models/patient.model";
import PatientForm from "./PatientForm";

function PatientEditScreen() {
    const dialog = useDialog();
    const navigate = useNavigate();
    const patient_id = useParams().patient_id
    const {
        loading,
        data,
    } = useQuery(gql`
        query($id: bigint!) { 
            patient_by_pk(id: $id) {
                ${PatientFragment}
            }
        }
    `, {
        variables: {
            id: patient_id,
        }
    })
    const [execute, save] = useMutation(gql`
        mutation save($id: bigint!, $set: patient_set_input!) {
            update_patient_by_pk(
                pk_columns: {id: $id},
                _set: $set,
            ) {
                ${PatientFragment}
            }
        }
    `)

    if (loading) {
        return <Loading />
    }
    const patient = data?.patient_by_pk as PatientModel;

    if (!patient) {
        return <NotFoundItem title="Sorry patient not found." />
    }

    const onSave = async (v: any) => {
        try {
            await execute({
                variables: {
                    id: patient.id,
                    set: v,
                }
            })
            navigate('..')
        } catch(e) {
            dialog.showError(e);
        }
    }



    return <div className='my-6 mx-auto container'>
        <BackButton href={`/patients/${patient.id}`} />
        <div className='mt-2 mb-4'>
            <p className='text-sm text-gray-500'>Edit Patient</p>
            <p className='font-bold'>{patient.first_name} {patient.last_name}</p>
        </div>
        <PatientForm
            patient={patient}
            loading={save.loading}
            onSave={onSave}
        />
    </div>
}

export default PatientEditScreen;
