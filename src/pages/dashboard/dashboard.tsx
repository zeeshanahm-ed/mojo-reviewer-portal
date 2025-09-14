import { useEffect, useState } from 'react';
import { Select, Button, Divider, Empty, Pagination, Tooltip } from 'antd';
//Hooks
import useGetCategoriesForDropDown from './core/hooks/useGetCategoriesForDropDown';
import useGetAllQuestions from './core/hooks/useGetAllQuestions';
import { getCurrentLanguage } from 'helpers/CustomHelpers';
//icons
// import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import FilterIcon from "../../assets/icons/filter-icon.svg?react";
import WrongIcon from "../../assets/icons/wrong-status-icon.svg?react";
import RightIcon from "../../assets/icons/right-status-icon.svg?react";
import AmbiguousIcon from "../../assets/icons/ambigous-status-icon.svg?react";
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import ReviewFiltersModal from 'components/modals/review-filters-modal';
import QuestionReviewModal from 'components/modals/question-review-modal';

const { Option } = Select;

interface StateType {
  selectedCategory: string,
  selectedDifficulty: string,
  categoriesOptions: any[]
}

interface ReviewFilters {
  reviewsCount: string[];
  reviewTypes: string[];
}

const QuestionsReview = () => {
  const currentLang = getCurrentLanguage();
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
  });
  const { allCategoriesData } = useGetCategoriesForDropDown();
  const { allQuestionsData, pagination, isLoading, refetch } = useGetAllQuestions(params);


  const [state, setState] = useState<StateType>({
    selectedCategory: "",
    selectedDifficulty: "",
    categoriesOptions: []
  });

  const [isReviewFiltersModalOpen, setIsReviewFiltersModalOpen] = useState(false);
  const [reviewFilters, setReviewFilters] = useState<ReviewFilters>({
    reviewsCount: [],
    reviewTypes: []
  });

  const [isQuestionReviewModalOpen, setIsQuestionReviewModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  useEffect(() => {
    if (!allCategoriesData?.length) return;
    const newOptions = allCategoriesData?.map((cat: any) => ({
      value: cat.id,
      label: cat.name,
    }));

    setState(prev => ({
      ...prev,
      categoriesOptions: [...newOptions],
    }));
  }, [allCategoriesData]);

  const handleSelectChange = (value: string, field: keyof StateType) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "selectedCategory") {
      setParams(prev => ({ ...prev, page: 1, categoryId: value }));
    } else if (field === "selectedDifficulty") {
      setParams(prev => ({ ...prev, page: 1, difficulty: value }));
    }
  };

  // Table headers configuration
  const tableHeaders = [
    { title: 'User ID', key: 'userId', className: "text-start" },
    { title: 'User Name', key: 'userName', className: "text-start" },
    { title: 'Question', key: 'question', className: "text-start" },
    { title: 'Category', key: 'category', className: "text-start" },
    { title: 'Difficulty', key: 'difficulty', className: "text-start" },
    { title: 'Reviews', key: 'reviews', className: "text-start" },
    { title: 'Action', key: 'action', className: "text-start" },
  ];

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  const handleApplyReviewFilters = (filters: ReviewFilters) => {
    setReviewFilters(filters);
    console.log(filters)
    setParams(prev => ({ ...prev, page: 1, filterByReviewsStatus: filters.reviewTypes }))
  };

  const handleClearReviewFilters = () => {
    setReviewFilters({
      reviewsCount: [],
      reviewTypes: []
    });
  };

  const handleReviewQuestion = (question: any) => {
    setSelectedQuestion(question);
    setIsQuestionReviewModalOpen(true);
  };

  const handleCloseQuestionReview = () => {
    setIsQuestionReviewModalOpen(false);
    setSelectedQuestion(null);
  };

  // Custom table component
  const CustomTable = () => (
    <div className="min-w-[1100px]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            {tableHeaders.map((header) => (
              <th key={header.key} className={`p-4 font-medium text-gray-700 ${header.className || 'text-left'}`}>
                {header.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allQuestionsData?.map((record: any) => (
            <tr key={record._id} className="border-b hover:bg-gray-50 transition-colors">
              <Tooltip title={record?.suggestedById}>
                <td className="p-4  truncate max-w-[80px]">
                  {record?.suggestedById}
                </td>
              </Tooltip>
              <td className="p-4">
                <span className="text-gray-700">{record?.suggestedByName}</span>

              </td>
              <td className="p-4">
                <span className="text-gray-700">{record.questionText?.en || record.questionText?.ar}</span>
              </td>
              <td className="p-4">
                <span className="text-gray-700">{record.categoryName?.en || record.categoryName?.ar}</span>
              </td>
              <td className="p-4">
                <span className="text-gray-700 font-normal capitalize">{record?.difficulty}</span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">{record.reviews.length + "/3"}</span>
                  <div className="flex gap-1">
                    {record?.reviews.map((reviewer: any, index: number) => {
                      const hasCorrectdecision = reviewer.decision.toLowerCase() === "correct";
                      const hasInCorrectdecision = reviewer.decision.toLowerCase() === "incorrect";
                      const hasAmbiguitydecision = reviewer.decision.toLowerCase() === "ambiguity";
                      return (
                        <span key={index}>
                          {hasCorrectdecision && <RightIcon />}
                          {hasInCorrectdecision && <WrongIcon />}
                          {hasAmbiguitydecision && <AmbiguousIcon />}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Button
                  type="primary"
                  onClick={() => handleReviewQuestion(record)}
                >
                  Review
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900 mb-2">
          Questions to review
        </h1>
        <p className="text-gray-600 text-base">
          Questions awaiting reviews. Each question needs up to 3 reviews to be finalized.
        </p>
      </div>

      <div className='border rounded-lg'>
        {/* Filter Section */}
        <div className="flex flex-wrap items-center py-1 px-4 gap-4 border-b">
          <div className="flex items-center gap-2 py-2" >
            <span className="text-medium-gray font-medium">Category :</span>
            <Select
              variant='borderless'
              allowClear={true}
              options={state.categoriesOptions}
              onChange={(value) => handleSelectChange(value, "selectedCategory")}
              value={state.selectedCategory || undefined}
              placeholder="All"
              className="w-36 lg:w-44"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              optionRender={(option) => (
                <div key={option.data.value}>
                  <span>{option.data.label}</span>
                </div>
              )}
            />
          </div>

          <Divider type='vertical' style={{ height: '30px' }} />

          <div className="flex items-center gap-2 py-2">
            <span className="text-medium-gray font-medium">Difficulty :</span>
            <Select
              allowClear={true}
              variant='borderless'
              value={state.selectedDifficulty}
              onChange={(value) => handleSelectChange(value, "selectedDifficulty")}
              className="w-36 lg:w-44"
              placeholder="All"
            >
              <Option value="easy">Easy</Option>
              <Option value="medium">Medium</Option>
              <Option value="hard">Hard</Option>
            </Select>
          </div>
          <Divider type='vertical' style={{ height: '30px' }} />
          <Button
            variant='text'
            icon={<FilterIcon className='mt-1' />}
            className="h-10 hover:text-black"
            onClick={() => setIsReviewFiltersModalOpen(true)}
          >
            Review Filters
          </Button>
        </div>

        {/* Table Section */}
        <div className=" w-full overflow-x-auto overflow-hidden">
          {isLoading ?
            <FallbackLoader />
            :
            <>
              {allQuestionsData?.length > 0 ?
                <CustomTable />
                :
                <Empty description="Data Not Found" />
              }
            </>
          }
        </div>
      </div>


      <Pagination
        className="mt-5 justify-center text-white"
        current={params?.page}
        pageSize={params?.limit}
        total={pagination?.total}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
      {/* Review Filters Modal */}
      <ReviewFiltersModal
        open={isReviewFiltersModalOpen}
        onClose={() => setIsReviewFiltersModalOpen(false)}
        onApplyFilters={handleApplyReviewFilters}
        onClearFilters={handleClearReviewFilters}
      />

      {/* Question Review Modal */}
      {selectedQuestion && (
        <QuestionReviewModal
          open={isQuestionReviewModalOpen}
          onClose={handleCloseQuestionReview}
          questionData={selectedQuestion}
          currentLanguage={currentLang}
          getReviewQuestionData={refetch}
        />
      )}
    </section>
  );
};

function Dashboard() {
  return <QuestionsReview />;
}

export default Dashboard;