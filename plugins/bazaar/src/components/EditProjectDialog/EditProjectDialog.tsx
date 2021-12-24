/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from 'react';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { ProjectDialog } from '../ProjectDialog';
import { BazaarProject, FormValues, Size, Status } from '../../types';
import { bazaarApiRef } from '../../api';
import { UseFormGetValues } from 'react-hook-form';

type Props = {
  entity: Entity;
  bazaarProject: BazaarProject;
  fetchBazaarProject: () => Promise<BazaarProject | null>;
  open: boolean;
  handleClose: () => void;
  isAddForm: boolean;
};

export const EditProjectDialog = ({
  entity,
  bazaarProject,
  fetchBazaarProject,
  open,
  handleClose,
}: Props) => {
  const [defaultValues, setDefaultValues] = useState<FormValues>({
    announcement: bazaarProject.announcement,
    community: bazaarProject.community,
    status: bazaarProject.status,
    size: bazaarProject.size,
    startDate: bazaarProject?.startDate ?? null,
    endDate: bazaarProject?.endDate ?? null,
    responsible: bazaarProject.responsible,
  });

  const bazaarApi = useApi(bazaarApiRef);

  useEffect(() => {
    setDefaultValues({
      announcement: bazaarProject.announcement,
      community: bazaarProject.community,
      status: bazaarProject.status,
      size: bazaarProject.size,
      startDate: bazaarProject?.startDate ?? null,
      endDate: bazaarProject?.endDate ?? null,
      responsible: bazaarProject.responsible,
    });
  }, [bazaarProject]);

  const handleSave: any = async (getValues: UseFormGetValues<FormValues>) => {
    const formValues = getValues();

    const updateResponse = await bazaarApi.updateMetadata({
      name: entity.metadata.name,
      entityRef: stringifyEntityRef(entity),
      announcement: formValues.announcement,
      status: formValues.status as Status,
      community: formValues.community,
      membersCount: bazaarProject.membersCount,
      size: formValues.size as Size,
      startDate: formValues?.startDate ?? null,
      endDate: formValues?.endDate ?? null,
      responsible: formValues.responsible,
    });

    if (updateResponse.status === 'ok') fetchBazaarProject();
    handleClose();
  };

  return (
    <ProjectDialog
      title="Edit project"
      handleSave={handleSave}
      isAddForm={false}
      defaultValues={defaultValues}
      open={open}
      handleClose={handleClose}
    />
  );
};
