import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '2fc6ae85ccd74036aa43d8338774cd74'
                    }
                    br_auto_create_manifest: {
                        table: 'sys_script'
                        id: '7742bf14095a443b87f0e0ab94955401'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'ee810db071fd4501bf5bf9a5df48c818'
                    }
                    prop_anthropic_api_key: {
                        table: 'sys_properties'
                        id: '14d92d12ee7d4426b9a7eef795214da1'
                    }
                    prop_anthropic_model: {
                        table: 'sys_properties'
                        id: '2025a28720cb4f869e53c0efd1727fc3'
                    }
                    prop_auto_create_manifest: {
                        table: 'sys_properties'
                        id: 'd1b798ddb6c94b6a9b9324eae71c9675'
                    }
                    prop_debug_logging: {
                        table: 'sys_properties'
                        id: '26ad4aaf2d274b5a9cd35bb57f0300c8'
                    }
                    prop_llm_max_tokens: {
                        table: 'sys_properties'
                        id: '034c99c25afa4fc3a5f74485a4d925e7'
                    }
                    prop_llm_provider: {
                        table: 'sys_properties'
                        id: 'e6da27a57fc64e67b15715f01366a346'
                    }
                    prop_llm_temperature: {
                        table: 'sys_properties'
                        id: 'a3da44e4eefd4cbd98246ac22e7d4cae'
                    }
                    prop_openai_api_key: {
                        table: 'sys_properties'
                        id: '1ff65357b1b64c22940583861f75b96f'
                    }
                    prop_openai_model: {
                        table: 'sys_properties'
                        id: 'e3aa527bb22d4b08927b658cb8b99589'
                    }
                    si_ai_orchestrator: {
                        table: 'sys_script_include'
                        id: 'f392ad87b08f46e690f41c9d01ea8c43'
                    }
                    si_atf_builder: {
                        table: 'sys_script_include'
                        id: '003bdae2834940bd885cc6ada0f89ae5'
                    }
                    si_llm_api_client: {
                        table: 'sys_script_include'
                        id: '08ccb02f06be42a0847c44592a60faa4'
                    }
                    si_manifest_helper: {
                        table: 'sys_script_include'
                        id: '938a25c19a8e440fbf02c56feb7f972c'
                    }
                    si_prompt_templates: {
                        table: 'sys_script_include'
                        id: '86b2438f3d2a4ad6960cacc70c51dc52'
                    }
                    'src_server_ai-orchestrator_js': {
                        table: 'sys_module'
                        id: 'e91b5ec0da3e43378126663ea44dc62b'
                    }
                    'src_server_atf-builder_js': {
                        table: 'sys_module'
                        id: 'ad08e6be38454e1bac4c61083bde1961'
                    }
                    'src_server_llm-api-client_js': {
                        table: 'sys_module'
                        id: '8a4bcefee35f47cb986c5f055ab6ffac'
                    }
                    'src_server_manifest-helper_js': {
                        table: 'sys_module'
                        id: '81eddc7513684bb4b6d7ad1d41980935'
                    }
                    'src_server_prompt-templates_js': {
                        table: 'sys_module'
                        id: 'e6f4158e34c349978864f90ed97cca1c'
                    }
                    ua_create_atf_records: {
                        table: 'sys_ui_action'
                        id: 'ca7b4da0e345441ebf979ca2885cd743'
                    }
                    ua_generate_code: {
                        table: 'sys_ui_action'
                        id: '8686ed4e1f404afc8432d20b9820f0fc'
                    }
                    ua_generate_test_steps: {
                        table: 'sys_ui_action'
                        id: 'f6d67c74e9194519aaa12676390de3a5'
                    }
                    ua_uplift_story: {
                        table: 'sys_ui_action'
                        id: '1fe5d1fe831f4d1d83038566258fbaf3'
                    }
                }
                composite: [
                    {
                        table: 'ua_table_licensing_config'
                        id: '09c0f4b68eb745a59bfa742d6772ef33'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0f2a699277c349c7bc7cc0b177dd4ea2'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'generated_unit_tests'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1dae937a43d343cd94d062e235a80f70'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'orchestration_log'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '29ff4524b6814ea68b955b508e9fcb4e'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'generated_code'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2dbaa3902c29465eb810627bd0aa48ae'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'orchestration_status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '472b8b04dc3b4599984ce98d4ee5fdc4'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'llm_model_used'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '48569f9fefaf41f8b0af3937c0ebecc8'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'story'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4adabaec7fb74c78a9dd4a641749bf4c'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'llm_model_used'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4c2710de5c5b4a1baf20191dd601fb10'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'uplifted_story'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4f093341711f4e9fa40f8e2c1d6ba7dc'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'atf_test_sys_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '537c9a0aa6cd4f0aa2eae300f0c63db4'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'orchestration_status'
                            value: 'running'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5707d80d3eb0447ebe9ab23ad6ff02ff'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'stakeholder_test_steps'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6a1ce015c0c642c28592e73b4e414165'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'orchestration_status'
                            value: 'failed'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6d5ea9b46bc04c1e8b9ff74cc7d5c5d9'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'generated_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7954670df7c84b6f9b39be96a70e8489'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '83a1602c711043268ce88c427d31546e'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'tokens_consumed'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '85c064f4d8284ac68f4bb15b67922503'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '981491707cf64d6c9af6a2441b68370e'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'uplifted_acceptance_criteria'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '981620baf67b4c47bd7b829cbdae520d'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'uplifted_acceptance_criteria'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a1fae55be4b64aad970f3ce8f1af6a46'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'uplifted_story'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a25848a994da4fc48cb8daa2ddfba663'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'atf_suite_sys_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'a31080bb717b4f2e87099f1e5db78db7'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'orchestration_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a9ad685885b34f39a1db9b95f9a2d2f3'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'orchestration_status'
                            value: 'partial'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'aba8f03b3f664e4cab153098d2086d04'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c19d6456dc2f40fcb77fc504a453b6b7'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'stakeholder_test_steps'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c515b6d8eaea4483a8ddb6ef616587bf'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'generated_unit_tests'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c940f723dcdf4341ba3629b64efb5309'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'atf_test_sys_id'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd0d9a58867be4799958d95aae336fa8b'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'orchestration_status'
                            value: 'completed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd308d150fb7944f49f54c29c187dd590'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'atf_suite_sys_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd47dc2d4f64642cd8b0b8f850dafa7ea'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'orchestration_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd6a8b399e38949c79f38180ab23a5c6f'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'last_run_by'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'dfc2e43e33004667b0440ada11be014a'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'orchestration_status'
                            value: 'pending'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e25201dded6c40598709e80e9d5b151e'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'last_run_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e9be900404f543f7ba3558f835a41989'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'story'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ef23b2fff0404559b28a9f0380245276'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'tokens_consumed'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f4560e32e5e642d1974f060feb3f4cf9'
                        key: {
                            name: 'x_1676392_sdlc_a_0_story_manifest'
                            element: 'orchestration_log'
                            language: 'en'
                        }
                    },
                ]
            }
        }
    }
}
