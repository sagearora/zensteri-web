import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../lib/BackButton";
import { PatientFragment } from "../../models/patient.model";
import { useClinic } from "../../services/clinic.context";
import { useDialog } from "../../lib/dialog.context";
import PatientForm from "./PatientForm";
import { QueryPatientList } from "./PatientListScreen";

function PatientCreateScreen() {
    const { clinic } = useClinic();
    const dialog = useDialog();
    const navigate = useNavigate();
    const [execute, { loading }] = useMutation(gql`
        mutation create($object: patient_insert_input!) {
            insert_patient_one(
                object: $object,
            ) {
                ${PatientFragment}
            }
        }
    `, {
        refetchQueries: [{
            query: QueryPatientList,
        }]
    })

    const onSave = async (v: any) => {
        try {
            await execute({
                variables: {
                    object: {
                        ...v,
                        clinic_id: clinic.id,
                    }
                }
            })
            navigate('..')
        } catch(e) {
            dialog.showError(e);
        }
    }



    return <div className='my-6 mx-auto container'>
        <div className='mb-4 flex items-center'>
            <BackButton href='/settings/sterilizers' />
            <p className='ml-2 font-bold'>Create Patient</p>
        </div>
        <PatientForm
            loading={loading}
            onSave={onSave}
        />
    </div>
}

export default PatientCreateScreen;
