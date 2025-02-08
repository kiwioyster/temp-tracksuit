import { BRANDS } from '../../lib/consts.ts';
import { Button } from '../button/button.tsx';
import { Modal, type ModalProps } from '../modal/modal.tsx';
import styles from './add-insight.module.css';
import { useState } from 'react';

type AddInsightProps = ModalProps & {
  onSuccess?: () => void;
};

export const AddInsight = ({ onSuccess, ...props }: AddInsightProps) => {
  const [brand, setBrand] = useState(BRANDS[0].id);
  const [text, setText] = useState('');

  const addInsight = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brand, text }),
      });

      if (!response.ok) throw new Error('Failed to create insight');

      onSuccess?.();
      props.onClose?.();
    } catch (error) {
      console.error('Failed to add insight:', error);
    }
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          <select
            className={styles['field-input']}
            value={brand}
            onChange={(e) => setBrand(Number(e.target.value))}
          >
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles['field-input']}
            rows={5}
            placeholder='Something insightful...'
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </label>
        <Button className={styles.submit} type='submit' label='Add insight' />
      </form>
    </Modal>
  );
};
// validation of input, loading state