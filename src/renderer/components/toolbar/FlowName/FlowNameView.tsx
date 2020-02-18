import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../models/AppState';
import { Form, Input, Button, Icon } from 'antd';
import styled from 'styled-components';
import { getByKey } from '../../../utils/utils';
import { changeFlowName } from './FlowNameViewActions';

const Title = styled('span')`
  font-size: 16pt;
  margin: 0;
`;

const TitleInput = styled(Input)`
  display: inline;
  font-size: 14pt;
`;

const TitleWrapper = styled('div')`
  display: flex;
  align-items: center;
`;

type Props = {};

const FlowNameView: React.FunctionComponent<Props> = ({}) => {
  const dispatch = useDispatch();

  const [draftName, setDraftName] = React.useState('');

  const [isEditingName, setIsEditingName] = React.useState(false);
  const startEditing = (): void => setIsEditingName(true);
  const stopEditing = (): void => setIsEditingName(false);

  const [isInvalidName, setIsInvalidName] = React.useState(false);

  const collections = useSelector((s: AppState) => s.collections);
  const collectionName = useSelector((s: AppState) => s.currentCollection);
  const flowName = useSelector((s: AppState) => s.currentFlow);
  React.useEffect(() => {
    setDraftName(flowName);
  }, [flowName]);

  const flows = getByKey(collections, collectionName)?.flows;

  if (!flows) return null;

  function checkName(newName: string): boolean {
    return newName === flowName || !flows?.map(([n]): string => n)?.includes(newName);
  }

  return (
    <TitleWrapper>
      {isEditingName ? (
        <Form.Item
          validateStatus={isInvalidName ? 'error' : ''}
          style={{ margin: 0 }}
          help={isInvalidName ? 'Invalid Name' : ''}
        >
          <TitleInput
            value={draftName}
            onChange={(e): void => {
              setIsInvalidName(!checkName(e.target.value));
              setDraftName(e.target.value);
            }}
            onKeyDown={(e): void => {
              switch (e.keyCode) {
                case 27: // esc
                  setDraftName(name);
                  stopEditing();
                  break;
                case 13: // enter
                  if (!isInvalidName) {
                    dispatch(changeFlowName(draftName));
                    stopEditing();
                  }
              }
            }}
          />
        </Form.Item>
      ) : (
        <>
          <Title>{draftName}</Title>
          <Button shape="circle" size="small" onClick={startEditing} style={{ marginLeft: 4 }}>
            <Icon type="edit" />
          </Button>
        </>
      )}
    </TitleWrapper>
  );
};

export default FlowNameView;