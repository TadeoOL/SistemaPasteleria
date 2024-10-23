import { Modal } from '@mui/material';
import { useMemo, ReactElement } from 'react';
import MainCard from '../components/MainCard';
import SimpleBar from '../components/third-party/SimpleBar';

// types
export type FormComponentProps<T, P = {}> = {
  [key: string]: T | null | (() => void) | any;
} & P;

interface ModalProps<T, P = {}> {
  open: boolean;
  modalToggler: (state: boolean) => void;
  formData: T | null;
  FormComponent: React.ComponentType<FormComponentProps<T, P>>;
  formDataPropName: string;
  additionalProps?: P;
}

export default function GenericModal<T extends object, P = {}>({
  open,
  modalToggler,
  formData,
  FormComponent,
  formDataPropName,
  additionalProps = {} as P
}: ModalProps<T, P>): ReactElement {
  const closeModal = () => modalToggler(false);

  const form = useMemo(() => {
    const props: FormComponentProps<T, P> = {
      [formDataPropName]: formData,
      closeModal,
      ...additionalProps
    };
    return <FormComponent {...props} />;
  }, [formData, FormComponent, formDataPropName, additionalProps]);

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
