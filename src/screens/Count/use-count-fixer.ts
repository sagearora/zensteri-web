import { gql, useApolloClient } from "@apollo/client";
import { CountModel } from "../../models/count.model"

export const useCountFixer = () => {
    const apollo = useApolloClient()
    const fixCount = async (count: CountModel) => {
        try {
            const { steri_item_tally } = count;
            const UpdateMutation = gql`
            mutation update {
                ${(steri_item_tally || []).map(steri_item => `
                    item_${steri_item.steri_item_id}: update_steri_item_by_pk(pk_columns: {id: ${steri_item.steri_item_id}}, _set: {
                        total_count: ${steri_item.total}
                    }) {
                        id
                        total_count
                    }
                `)}
            }
        `;
            const { data } = await apollo.mutate({
                mutation: UpdateMutation
            })
            return data;
        } catch (e) {
            return null;
        }
    }

    return {
        fixCount
    }
}