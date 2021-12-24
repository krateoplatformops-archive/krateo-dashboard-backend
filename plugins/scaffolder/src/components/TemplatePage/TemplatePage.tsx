/*
 * Copyright 2020 The Backstage Authors
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
import { JsonObject, JsonValue } from '@backstage/types';
import { LinearProgress } from '@material-ui/core';
import { FormValidation, IChangeEvent } from '@rjsf/core';
import React, { useCallback, useState } from 'react';
import { generatePath, Navigate, useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { scaffolderApiRef } from '../../api';
import { CustomFieldValidator, FieldExtensionOptions } from '../../extensions';
import { rootRouteRef } from '../../routes';
import { MultistepJsonForm } from '../MultistepJsonForm';

import {
  Content,
  Header,
  InfoCard,
  Lifecycle,
  Page,
} from '@backstage/core-components';
import {
  ApiHolder,
  errorApiRef,
  useApi,
  useApiHolder,
  useRouteRef,
} from '@backstage/core-plugin-api';

const useTemplateParameterSchema = (templateName: string) => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const { value, loading, error } = useAsync(
    () =>
      scaffolderApi.getTemplateParameterSchema({
        name: templateName,
        kind: 'template',
        namespace: 'default',
      }),
    [scaffolderApi, templateName],
  );
  return { schema: value, loading, error };
};

function isObject(obj: unknown): obj is JsonObject {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export const createValidator = (
  rootSchema: JsonObject,
  validators: Record<string, undefined | CustomFieldValidator<unknown>>,
  context: {
    apiHolder: ApiHolder;
  },
) => {
  function validate(
    schema: JsonObject,
    formData: JsonObject,
    errors: FormValidation,
  ) {
    const schemaProps = schema.properties;
    if (!isObject(schemaProps)) {
      return;
    }

    for (const [key, propData] of Object.entries(formData)) {
      const propValidation = errors[key];

      if (isObject(propData)) {
        const propSchemaProps = schemaProps[key];
        if (isObject(propSchemaProps)) {
          validate(
            propSchemaProps,
            propData as JsonObject,
            propValidation as FormValidation,
          );
        }
      } else {
        const propSchema = schemaProps[key];
        const fieldName =
          isObject(propSchema) && (propSchema['ui:field'] as string);
        if (fieldName && typeof validators[fieldName] === 'function') {
          validators[fieldName]!(
            propData as JsonValue,
            propValidation,
            context,
          );
        }
      }
    }
  }

  return (formData: JsonObject, errors: FormValidation) => {
    validate(rootSchema, formData, errors);
    return errors;
  };
};

export const TemplatePage = ({
  customFieldExtensions = [],
}: {
  customFieldExtensions?: FieldExtensionOptions[];
}) => {
  const apiHolder = useApiHolder();
  const errorApi = useApi(errorApiRef);
  const scaffolderApi = useApi(scaffolderApiRef);
  const { templateName } = useParams();
  const navigate = useNavigate();
  const rootLink = useRouteRef(rootRouteRef);
  const { schema, loading, error } = useTemplateParameterSchema(templateName);
  const [formState, setFormState] = useState({});
  const handleFormReset = () => setFormState({});
  const handleChange = useCallback(
    (e: IChangeEvent) => setFormState(e.formData),
    [setFormState],
  );

  const handleCreate = async () => {
    const id = await scaffolderApi.scaffold(templateName, formState);
    navigate(generatePath(`${rootLink()}/tasks/:taskId`, { taskId: id }));
  };

  if (error) {
    errorApi.post(new Error(`Failed to load template, ${error}`));
    return <Navigate to={rootLink()} />;
  }
  if (!loading && !schema) {
    errorApi.post(new Error('Template was not found.'));
    return <Navigate to={rootLink()} />;
  }

  const customFieldComponents = Object.fromEntries(
    customFieldExtensions.map(({ name, component }) => [name, component]),
  );

  const customFieldValidators = Object.fromEntries(
    customFieldExtensions.map(({ name, validation }) => [name, validation]),
  );

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Create a New Component"
        title={
          <>
            Create a New Component <Lifecycle shorthand />
          </>
        }
        subtitle="Create new software components using standard templates"
      />
      <Content>
        {loading && <LinearProgress data-testid="loading-progress" />}
        {schema && (
          <InfoCard
            title={schema.title}
            noPadding
            titleTypographyProps={{ component: 'h2' }}
          >
            <MultistepJsonForm
              formData={formState}
              fields={customFieldComponents}
              onChange={handleChange}
              onReset={handleFormReset}
              onFinish={handleCreate}
              steps={schema.steps.map(step => {
                return {
                  ...step,
                  validate: createValidator(
                    step.schema,
                    customFieldValidators,
                    { apiHolder },
                  ),
                };
              })}
            />
          </InfoCard>
        )}
      </Content>
    </Page>
  );
};
