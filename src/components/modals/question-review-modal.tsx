import React, { useState } from 'react';
import { Button, Modal, Input, Tooltip, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useAddReview from 'pages/dashboard/core/hooks/useAddReview';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
//icons
import WrongIcon from "../../assets/icons/wrong-status-icon.svg?react";
import RightIcon from "../../assets/icons/right-status-icon.svg?react";
import AmbiguousIcon from "../../assets/icons/ambigous-status-icon.svg?react";
import QuestionIcon from "../../assets/icons/question-icon.svg?react"

const { TextArea } = Input;

interface QuestionReviewModalProps {
    open: boolean;
    onClose: () => void;
    getReviewQuestionData: () => void;
    questionData: any;
    currentLanguage: string;
}

type ReviewType = 'right' | 'wrong' | 'ambiguity' | "";
interface ReviewData {
    reviewType: ReviewType
    explanation?: string;
}

const QuestionReviewModal: React.FC<QuestionReviewModalProps> = ({ getReviewQuestionData, open, onClose,
    questionData,
    currentLanguage
}) => {
    const [reviewData, setReviewData] = useState<ReviewData>({
        reviewType: '',
        explanation: ''
    });
    const [showReviewsOprions, setShowReviewsOptions] = useState(false);
    const { addReviewMutate, isLoading } = useAddReview();

    const handleReviewTypeChange = (reviewOption: ReviewType) => {
        setReviewData(prev => ({
            ...prev,
            reviewType: reviewOption,
            explanation: reviewOption === 'ambiguity' ? prev.explanation : ''
        }));
    };

    const handleExplanationChange = (e: any) => {
        setReviewData(prev => ({
            ...prev,
            explanation: e.target.value
        }));
    };


    const handleShowReviewsOptions = () => {
        setShowReviewsOptions(true)
    };

    const getQuestionText = () => {
        return questionData?.questionText?.[currentLanguage] || questionData?.questionText?.en || '';
    };
    const getAnswerExplanationText = () => {
        return questionData?.answerExplanation?.[currentLanguage] || questionData?.answerExplanation?.en || '';
    };

    const getOptions = () => {
        return questionData?.options?.[currentLanguage] || questionData?.options?.en || [];
    };

    const getCorrectAnswer = () => {
        return questionData?.correctAnswer?.[currentLanguage] || questionData?.correctAnswer?.en || '';
    };
    const getCategoryName = () => {
        return questionData?.categoryName?.[currentLanguage] || questionData?.categoryName?.en || 'Category  Name';
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-800 border-green-200';
            case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'hard': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const renderMedia = (mediaUrl: string) => {
        if (!mediaUrl) return null;
        const mediaType = getMediaType(mediaUrl)

        switch (mediaType) {
            case 'image':
                return (
                    <div className="mt-2">
                        <img
                            loading='lazy'
                            src={mediaUrl}
                            alt="Question media"
                            className="w-full h-48 object-contain rounded-lg border"
                        />
                    </div>
                );
            case 'audio':
                return (
                    <div className="mt-2">
                        <audio controls className="w-full">
                            <source src={mediaUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                );
            case 'video':
                return (
                    <div className="mt-2">
                        <video controls className="w-full h-48 rounded-lg border">
                            <source src={mediaUrl} type="video/mp4" />
                            Your browser does not support the video element.
                        </video>
                    </div>
                );
            default:
                return null;
        }
    };

    // Supported media types for all browsers
    type SupportedImageTypes = 'jpg' | 'jpeg' | 'png' | 'gif' | 'bmp' | 'webp';
    type SupportedAudioTypes = 'mp3' | 'wav' | 'ogg' | 'aac' | 'm4a';
    type SupportedVideoTypes = 'mp4' | 'webm' | 'ogg' | 'wav';

    type MediaType = 'image' | 'audio' | 'video' | 'unknown';

    // Helper function to extract file extension and determine media type
    const getMediaType = (mediaUrl: string): MediaType => {
        if (!mediaUrl) return 'unknown';
        const extensionMatch = mediaUrl.split('.').pop()?.toLowerCase().split(/\#|\?/)[0];
        if (!extensionMatch) return 'unknown';

        const imageTypes: SupportedImageTypes[] = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const audioTypes: SupportedAudioTypes[] = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];
        const videoTypes: SupportedVideoTypes[] = ['mp4', 'webm', 'ogg'];

        if (imageTypes.includes(extensionMatch as SupportedImageTypes)) {
            return 'image';
        }
        if (audioTypes.includes(extensionMatch as SupportedAudioTypes)) {
            return 'audio';
        }
        if (videoTypes.includes(extensionMatch as SupportedVideoTypes)) {
            return 'video';
        }
        return 'unknown';
    };

    const options = getOptions();
    const correctAnswer = getCorrectAnswer();

    const handleAddReview = () => {
        const body = {
            categoryId: questionData?.categoryId,
            questionId: questionData?.questionId,
            reason: reviewData?.reviewType === "ambiguity" ? reviewData.explanation : "",
            decision: reviewData.reviewType === "right" ? "Correct" : reviewData.reviewType === "wrong" ? "Incorrect" : "Ambiguous"
        }

        addReviewMutate(body, {
            onSuccess: async () => {
                showSuccessMessage('Question updated successfully.');
                getReviewQuestionData();
                onClose();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={
                <div className="flex max-w-[95%] items-center justify-between gap-2">
                    <div className='flex items-center gap-x-5'>
                        <QuestionIcon />
                        <p className='font-normal text-2xl'>Question</p>
                    </div>
                    <div className='flex items-center gap-x-2 font-normal'>
                        <Tooltip title={questionData?.suggestedById}>
                            <p className='truncate max-w-[50px]'>{questionData?.suggestedById}</p>
                        </Tooltip>
                        <p >{questionData?.suggestedByName}</p>
                    </div>
                </div>
            }
            width={600}
            footer={null}
            centered
            maskClosable={false}
            className="question-review-modal"
            closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-600" />}
        >
            {isLoading && <FallbackLoader isModal={true} />}
            <div>

                {/* Tags and Reviews */}
                <div className="flex items-center gap-3 mb-6 mt-5">
                    <Tooltip title={getCategoryName()}>
                        <span className="truncate max-w-[150px] px-3 py-2 bg-[#A2A2A2] text-white rounded border-[#747474] text-sm">
                            {getCategoryName()}
                        </span>
                    </Tooltip>
                    <span className={`px-3 py-2 rounded capitalize text-sm border ${getDifficultyColor(questionData?.difficulty)}`}>
                        {questionData?.difficulty}
                    </span>
                    <div className="flex items-center  px-3 py-2 gap-3 border rounded flex-1">
                        {questionData.reviews?.length > 0 ? (
                            questionData.reviews.map((review: any, index: number) => (
                                <div key={index} className="flex  items-center gap-1">
                                    <Tooltip title={review.reviewerName}>
                                        <span className="text-sm text-gray-700 max-w-[110px] truncate">{review.reviewerName}</span>
                                    </Tooltip>
                                    {review.decision === 'Correct' && <RightIcon />}
                                    {review.decision === 'Incorrect' && <WrongIcon />}
                                    {review.decision === 'Ambiguous' && <AmbiguousIcon />}
                                </div>
                            ))
                        ) : (
                            <span className="text-sm text-gray-400">No reviews yet</span>
                        )}
                    </div>
                </div>
                <Divider />
                {/* Question Section */}
                <div className="mb-6">
                    <h3 className="text-sm text-gray-700 mb-2">Question</h3>
                    <p className="text-base font-normal text-gray-900 mb-3">{getQuestionText()}</p>

                    {/* Question Media - Replace with actual media data when available */}
                    {questionData?.mediaUrl && renderMedia(questionData.mediaUrl)}
                </div>

                {/* Answer Options */}
                {options.length > 0 && <div className="mb-6">
                    <h3 className="text-sm text-gray-700 mb-2">Answer Options</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {options.map((option: string, index: number) => {
                            const isCorrect = option === correctAnswer;
                            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D

                            return (
                                <button
                                    key={index}
                                    className={`cursor-default p-4 text-left rounded-lg border-2 transition-all ${isCorrect
                                        ? 'bg-green-50 border-green-300 text-green-800'
                                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="font-medium">({optionLetter})</span> {option}
                                </button>
                            );
                        })}
                    </div>
                </div>}

                {/* Answer Explanation */}
                {questionData?.answerExplanation && (
                    <div className="mb-6">
                        <h3 className="text-sm text-gray-700 mb-2">Answer Explanation</h3>
                        <p className="text-base font-normal text-gray-900 mb-3">{getAnswerExplanationText()}</p>

                        {/* Answer Explanation Media - Replace with actual media data when available */}
                        {questionData?.answerMediaUrl && renderMedia(questionData.answerMediaUrl)}
                    </div>
                )}
                <Divider />
                {!showReviewsOprions && <div className="flex justify-start">
                    <Button
                        type="primary"
                        onClick={handleShowReviewsOptions}
                        className="h-12 font-normal"
                    >
                        Review Question
                    </Button>
                </div>}
                {/* Submit Review Section */}
                {showReviewsOprions ?
                    <>
                        <h3 className="text-sm text-gray-700 mb-2">Submit Review</h3>
                        <div className='flex items-center gap-x-5'>
                            <Button
                                type="default"
                                icon={<RightIcon />}
                                onClick={() => handleReviewTypeChange("right")}
                                className={`h-12 w-28 font-normal text-[#10992D] hover:border-[#10992D] ${reviewData.reviewType === 'right' && "border-[#10992D]"}`}
                            >
                                Right
                            </Button>
                            <Button
                                type="default"
                                icon={<WrongIcon />}
                                onClick={() => handleReviewTypeChange("wrong")}
                                className={`h-12 w-32 font-normal text-[#A20B0B] hover:border-[#A20B0B] ${reviewData.reviewType === 'wrong' && "border-[#A20B0B]"}`}
                            >
                                Wrong
                            </Button>
                            <Button
                                icon={<AmbiguousIcon />}
                                type="default"
                                onClick={() => handleReviewTypeChange("ambiguity")}
                                className={`h-12 w-36 font-normal text-[#DA9526] hover:border-[#DA9526] ${reviewData.reviewType === 'ambiguity' && "border-[#DA9526]"}`}
                            >
                                Ambiguity
                            </Button>
                            <Divider type='vertical' style={{ height: '30px' }} />
                            <Button
                                disabled={reviewData.reviewType === "ambiguity" && reviewData.explanation === "" || reviewData.reviewType === ""}
                                type="primary"
                                onClick={handleAddReview}
                                className="h-12 font-normal"
                            >
                                Submit
                            </Button>
                        </div>
                        {/* Conditional Textarea for Ambiguity */}
                        {reviewData.reviewType === 'ambiguity' && (
                            <div className="mt-4">
                                <TextArea
                                    placeholder="Explain why this question is ambiguous"
                                    value={reviewData.explanation}
                                    onChange={handleExplanationChange}
                                    rows={4}
                                    className="w-full resize-none max-h-[100px]"
                                />
                            </div>
                        )}
                    </>
                    : <></>
                }
            </div>
        </Modal>
    );
};

export default QuestionReviewModal;