import { useMemo, ReactElement } from 'react';
import Modal from '@mui/material/Modal';
import MainCard from '../components/MainCard';
import SimpleBar from '../components/third-party/SimpleBar';

// types
export type FormComponentProps<T> = {
  [key: string]: T | null | (() => void);
};

interface ModalProps<T> {
  open: boolean;
  modalToggler: (state: boolean) => void;
  formData: T | null;
  FormComponent: React.ComponentType<FormComponentProps<T>>;
  formDataPropName: string;
}

export default function GenericModal<T extends object>({
  open,
  modalToggler,
  formData,
  FormComponent,
  formDataPropName
}: ModalProps<T>): ReactElement {
  const closeModal = () => modalToggler(false);

  const form = useMemo(() => {
    const props: FormComponentProps<T> = {
      [formDataPropName]: formData,
      closeModal
    };
    return <FormComponent {...props} />;
  }, [formData, FormComponent, formDataPropName]);

  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-generic-label"
      aria-describedby="modal-generic-description"
      sx={{
        '& .MuiPaper-root:focus': {
          outline: 'none'
        }
      }}
    >
      <MainCard
        sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
        modal
        content={false}
      >
        <SimpleBar
          sx={{
            maxHeight: `calc(100vh - 48px)`,
            '& .simplebar-content': {
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          {form}
        </SimpleBar>
      </MainCard>
    </Modal>
  );
}
