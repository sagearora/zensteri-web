import { gql } from "@apollo/client";
import { AppointmentFragment } from "./models/appointment.model";
import { OpFragment } from "./models/op.model";
import { SteriItemFragment } from "./models/steri-item.model";
import { SteriLabelFragment } from "./models/steri-label.model";
import { SteriFragment } from "./models/steri.model";
import { TaskFragment } from "./models/task.model";


export const QueryAllSteriItems = ({showArchived, f = SteriItemFragment}: {showArchived?: boolean; f?: string}) => gql`
    query steri_item {
        steri_item (where: {
            ${showArchived ? '' : `archived_at: {_is_null: true}`},
        }, order_by: {category: asc}) {
            ${f}
        }
    }`;


export const QueryOpList = (f = OpFragment) => gql`
query list_ops($cursor: bigint!, $limit: Int!) { 
    op(limit: $limit, where: {
        id: {_gt: $cursor}
    }, order_by: {id: asc}) {
        ${f}
    }
}
`


export const QueryAppointmentsByDate = ({ f = AppointmentFragment, sub }: {
    f?: string;
    sub?: boolean;
}) => gql`
${sub ? 'subscription' : 'query'} list_appointments($date: date!, $cursor: bigint!, $limit: Int!) { 
    appointment(limit: $limit, where: {
        _and: [
            {schedule_date: {_eq: $date}},
            {id: {_gt: $cursor}},
        ]
    }, order_by: {id: asc}) {
        ${f}
    }
}
`


export const QuerySteriList = (f = SteriFragment, archived?: boolean) => gql`
query steri { 
    steri(order_by: {id: desc}, where: {archived_at: {_is_null: true}}) {
        ${f}
    }
}
`

export const QueryLabelList= ({
    sub,
    f = SteriLabelFragment
}: {
    sub?: boolean;
    f?: string;
}) => gql`
    ${sub ? 'subscription' : 'query'} steri_label($limit: Int!, $cursor: bigint!) {
        steri_label(
            limit: $limit, where: {
            id: {_lt: $cursor}
        }, order_by: {id: desc}) {
            ${f}
        }
    }
`;


export const QueryTaskList = ({
    sub,
    f = TaskFragment
}: {
    sub?: boolean;
    f?: string;
}) => gql`
    ${sub ? 'subscription' : 'query'} task($limit: Int!, $cursor: bigint!) {
        task(
            limit: $limit, where: {
            id: {_gt: $cursor}
        }, order_by: {id: asc}) {
            ${f}
        }
    }
`;