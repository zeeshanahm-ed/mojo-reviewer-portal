import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Divider, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDirection } from 'hooks/useGetDirection';

interface ReviewFiltersModalProps {
    open: boolean;
    onClose: () => void;
    onApplyFilters: (filters: ReviewFilters) => void;
    onClearFilters: () => void;
    filters: ReviewFilters,
}

interface ReviewFilters {
    reviewsCount: string[];
    reviewTypes: string[];
}

interface FilterOption {
    label: string;
    value: string;
    count: number;
}

const ReviewFiltersModal: React.FC<ReviewFiltersModalProps> = ({
    open,
    onClose,
    onApplyFilters,
    onClearFilters,
    filters,
}) => {
    const { t } = useTranslation();
    const direction = useDirection();
    const [tempFilters, setTempFilters] = useState<ReviewFilters>({ reviewsCount: [], reviewTypes: [] });

    useEffect(() => {
        if (open) {
            setTempFilters(filters || { reviewsCount: [], reviewTypes: [] });
        }
    }, [open, filters]);

    const reviewsCountOptions: FilterOption[] = [
        { label: t('0 Reviews'), value: '0', count: 3 },
        { label: t('1 Reviews'), value: '1', count: 1 },
        { label: t('2 Reviews'), value: '2', count: 0 }
    ];

    const reviewTypesOptions: FilterOption[] = [
        { label: t('Right'), value: 'Correct', count: 3 },
        { label: t('Wrong'), value: 'Incorrect', count: 1 },
        { label: t('Ambiguous'), value: 'Ambiguous', count: 0 }
    ];

    const handleCheckboxChange = (type: 'reviewsCount' | 'reviewTypes', value: string, checked: boolean) => {
        setTempFilters((prev) => ({
            ...prev,
            [type]: checked
                ? [...prev[type], value]
                : prev[type].filter((item: any) => item !== value)
        }));
    };

    const handleApplyFilters = () => {
        onApplyFilters(tempFilters);
        onClose();
    };

    const handleClearFilters = () => {
        setTempFilters({
            reviewsCount: [],
            reviewTypes: []
        });
        onClearFilters();
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={<p className='font-normal text-2xl'>{t('Review Filters')}</p>}
            width={500}
            footer={null}
            centered
            maskClosable={false}
            className={`${direction === 'rtl' ? 'font-arabic' : 'font-primary'}`}
            closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-600" />}
        >
            <Divider />
            {/* Content */}
            <div className="py-2">
                {/* Reviews Count Section */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">{t('Reviews Count')}</h3>
                    <div className="space-y-3">
                        {reviewsCountOptions.map((option) => (
                            <div key={option.value} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={tempFilters.reviewsCount.includes(option.value)}
                                        onChange={(e) => handleCheckboxChange('reviewsCount', option.value, e.target.checked)}
                                        className="mr-3"
                                    >
                                        <span className="text-sm text-gray-700">{option.label}</span>
                                    </Checkbox>
                                </div>
                                {/* <span className="text-sm text-gray-500">({option.count})</span> */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 mb-6"></div>

                {/* Review Types Section */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">{t('Review Types')}</h3>
                    <div className="space-y-3">
                        {reviewTypesOptions.map((option) => (
                            <div key={option.value} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={tempFilters.reviewTypes.includes(option.value)}
                                        onChange={(e) => handleCheckboxChange('reviewTypes', option.value, e.target.checked)}
                                        className="mr-3"
                                    >
                                        <span className="text-sm text-gray-700">{option.label}</span>
                                    </Checkbox>
                                </div>
                                {/* <span className="text-sm text-gray-500">({option.count})</span> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t">
                {(filters.reviewTypes.length > 0 || filters.reviewsCount.length > 0) ?
                    <button
                        onClick={handleClearFilters}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <CloseOutlined className="mr-2 text-xs" />
                        <span className="underline">{t('Clear Filters')}</span>
                    </button> : null}
                <Button
                    type="primary"
                    onClick={handleApplyFilters}
                >
                    {t('Apply Filters')}
                </Button>
            </div>
        </Modal>
    );
};

export default ReviewFiltersModal;
