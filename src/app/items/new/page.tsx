'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { ItemImage } from '@/components/item-image';
import { Field, FormMessage } from '@/components/ui';
import { CATEGORY_LABELS, CONDITION_LABELS, IMAGE_OPTIONS } from '@/lib/labels';
import type { Item } from '@/lib/types';
import { useForm } from '@/lib/use-form';

// S3. 용품 등록
export default function NewItemPage() {
  const router = useRouter();
  const { values, set, errors, submitting, submit } = useForm({
    code: '',
    name: '',
    category: '',
    minAgeMonths: '',
    maxAgeMonths: '',
    condition: '',
    memo: '',
    brand: '',
    modelName: '',
    purchasedAt: '',
    imageUrl: '',
  });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const item = await submit<Item>('/items', 'POST', values);
    if (item) router.push(`/items/${item.id}`);
  }

  return (
    <>
      <p className="breadcrumb">
        <Link href="/items">용품 목록</Link> / 용품 등록
      </p>
      <h1>용품 등록</h1>
      <form className="form" onSubmit={onSubmit} noValidate>
        <Field id="code" label="관리 번호" error={errors.code} hint="분류 앞글자 + 숫자 3자리 (예: MOV-001, SLP-002, FED-003, PLY-004)">
          <input id="code" value={values.code} onChange={set('code')} placeholder="MOV-001" autoComplete="off" />
        </Field>
        <Field id="name" label="용품 이름" error={errors.name}>
          <input id="name" value={values.name} onChange={set('name')} placeholder="휴대용 유모차" />
        </Field>
        <Field id="category" label="분류" error={errors.category}>
          <select id="category" value={values.category} onChange={set('category')}>
            <option value="">골라 주세요</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <div className="field-row">
          <Field id="minAgeMonths" label="사용 시작 월령 (개월)" error={errors.minAgeMonths}>
            <input id="minAgeMonths" type="number" inputMode="numeric" value={values.minAgeMonths} onChange={set('minAgeMonths')} placeholder="0" />
          </Field>
          <Field id="maxAgeMonths" label="사용 끝 월령 (개월)" error={errors.maxAgeMonths}>
            <input id="maxAgeMonths" type="number" inputMode="numeric" value={values.maxAgeMonths} onChange={set('maxAgeMonths')} placeholder="36" />
          </Field>
        </div>
        <Field id="condition" label="용품 상태" error={errors.condition} hint="용품 자체가 낡았거나 고장 났는지를 골라 주세요. 소독 여부와는 관계없어요.">
          <select id="condition" value={values.condition} onChange={set('condition')}>
            <option value="">골라 주세요</option>
            {Object.entries(CONDITION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <h2 className="form-section">제품 정보 (선택)</h2>
        <div className="field-row">
          <Field id="brand" label="브랜드" error={errors.brand}>
            <input id="brand" value={values.brand} onChange={set('brand')} placeholder="햇빛베이비" />
          </Field>
          <Field id="modelName" label="모델명" error={errors.modelName}>
            <input id="modelName" value={values.modelName} onChange={set('modelName')} placeholder="산책 S2 (HB-S210)" />
          </Field>
        </div>
        <Field id="purchasedAt" label="구매일" error={errors.purchasedAt}>
          <input id="purchasedAt" type="date" value={values.purchasedAt} onChange={set('purchasedAt')} />
        </Field>
        <Field id="imageUrl" label="대표 사진" error={errors.imageUrl} hint="미리 준비된 데모 그림 중에서 고르거나, 고르지 않으면 기본 그림을 써요.">
          <div className="image-picker">
            <ItemImage src={values.imageUrl || null} alt="고른 대표 사진 미리보기" size="preview" />
            <select id="imageUrl" value={values.imageUrl} onChange={set('imageUrl')}>
              <option value="">기본 그림 (사진 없음)</option>
              {IMAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </Field>
        <Field id="memo" label="메모 (선택)" error={errors.memo}>
          <textarea id="memo" value={values.memo} onChange={set('memo')} rows={3} placeholder="바퀴 한쪽 소음 있음" />
        </Field>
        <FormMessage message={errors._form} />
        <div className="form-actions">
          <Link className="button button-secondary" href="/items">
            취소
          </Link>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? '저장하는 중…' : '등록하기'}
          </button>
        </div>
      </form>
    </>
  );
}
