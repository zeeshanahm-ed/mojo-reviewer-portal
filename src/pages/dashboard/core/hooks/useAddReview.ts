import { useMutation } from 'react-query';
import { addReview } from '../_request';

const useAddReview = () => {
    const { mutate, isError, error, isLoading, isSuccess } = useMutation((body: any) => addReview(body));

    return { addReviewMutate: mutate, isError, error, isLoading, isSuccess };
};

export default useAddReview;