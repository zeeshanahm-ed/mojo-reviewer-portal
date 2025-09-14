import api from 'services/api/api';


const CATEGORY_URL = "category";


export function getAllCategoriesDataForDropDown() {
  return api.get(`${CATEGORY_URL}/dropdown`).then((response) => response.data);
};
export function getAllQuestions(params: any) {
  return api.get(`/contribution/all-reviews`, { params }).then((response) => response.data);
};
export function addReview(body: any) {
  return api.post(`/contribution/review-decision`, body).then((response) => response.data);
};

