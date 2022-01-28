#[macro_use]
extern crate napi_derive;
extern crate parcel_sourcemap;
extern crate rkyv;

use napi::{bindgen_prelude::*, Env, JsString};
use parcel_sourcemap::{Mapping, OriginalLocation, SourceMap};
use rkyv::AlignedVec;
use serde_json::{from_str, to_string};

#[cfg(target_os = "macos")]
#[global_allocator]
static GLOBAL: jemallocator::Jemalloc = jemallocator::Jemalloc;

#[napi(js_name = "SourceMap")]
pub struct JsSourceMap(SourceMap);

#[napi(object)]
pub struct Position {
    pub line: u32,
    pub column: u32,
}

#[napi(object)]
pub struct MappingObject {
    pub original: Option<Position>,
    pub generated: Position,
    pub source: Option<u32>,
    pub name: Option<u32>,
}

#[napi(object)]
pub struct VlqMapping {
    pub mappings: JsString,
    pub sources: Array,
    pub sources_content: Array,
    pub names: Array,
}

#[napi]
impl JsSourceMap {
    #[napi(constructor)]
    pub fn new(project_root: String, second_argument: Option<Buffer>) -> Result<Self> {
        match second_argument {
            Some(js_buffer) => Ok(Self(SourceMap::from_buffer(
                project_root.as_str(),
                js_buffer.as_ref(),
            )?)),
            None => Ok(Self(SourceMap::new(project_root.as_str()))),
        }
    }

    #[napi]
    pub fn add_source(&mut self, source: String) -> u32 {
        self.0.add_source(source.as_str())
    }

    #[napi]
    pub fn get_source(&self, source_index: u32) -> String {
        match self.0.get_source(source_index) {
            Ok(source) => source,
            Err(_err) => "",
        }
        .to_owned()
    }

    #[napi]
    pub fn _get_sources(&self) -> &Vec<String> {
        self.0.get_sources()
    }

    #[napi]
    pub fn get_sources(&self) -> Result<String> {
        Ok(to_string(self.0.get_sources())?)
    }

    #[napi]
    pub fn get_sources_content(&self) -> &Vec<String> {
        self.0.get_sources_content()
    }

    #[napi]
    pub fn get_source_index(&self, source: String) -> Result<i32> {
        Ok(self
            .0
            .get_source_index(source.as_str())?
            .map(|i| i as i32)
            .unwrap_or(-1))
    }

    #[napi]
    pub fn set_source_content_by_source(
        &mut self,
        source: String,
        source_content: String,
    ) -> Result<()> {
        let source_index: usize = self.0.add_source(source.as_str()) as usize;
        self.0
            .set_source_content(source_index, source_content.as_str())?;
        Ok(())
    }

    #[napi]
    pub fn get_source_content_by_source(&self, source: String) -> Result<String> {
        let source_index = self.0.get_source_index(source.as_str())?;
        Ok(match source_index {
            Some(i) => self.0.get_source_content(i)?,
            None => "",
        }
        .to_owned())
    }

    #[napi]
    pub fn add_name(&mut self, name: String) -> u32 {
        self.0.add_name(name.as_str())
    }

    #[napi]
    pub fn get_name(&self, name_index: u32) -> String {
        match self.0.get_name(name_index) {
            Ok(name) => name,
            Err(_err) => "",
        }
        .to_owned()
    }

    #[napi]
    pub fn get_names(&self) -> Result<String> {
        Ok(to_string(&self.0.get_names())?)
    }

    #[napi]
    pub fn get_name_index(&self, name: String) -> Result<i32> {
        Ok(self
            .0
            .get_name_index(name.as_str())
            .map(|i| i as i32)
            .unwrap_or(-1))
    }

    #[napi(
        ts_args_type = "mapping: { generatedLine: number; generatedColumn: number; original?: { originalLine: number; originalColumn: number; source: number; name?: number; } }"
    )]
    pub fn mapping_to_js_object(&self, mapping: Mapping) -> MappingObject {
        let generated_position_obj = Position {
            line: mapping.generated_line + 1,
            column: mapping.generated_column,
        };

        let original_position = mapping.original;
        MappingObject {
            generated: generated_position_obj,
            original: original_position.map(|original_position| Position {
                line: original_position.original_line + 1,
                column: original_position.original_column,
            }),
            source: original_position.map(|o| o.source),
            name: original_position.and_then(|o| o.name),
        }
    }

    #[napi]
    pub fn get_mappings(&self) -> Vec<MappingObject> {
        self.0
            .get_mappings()
            .iter()
            .map(|mapping| MappingObject {
                generated: Position {
                    line: mapping.generated_line + 1,
                    column: mapping.generated_column,
                },
                original: mapping.original.map(|original_position| Position {
                    line: original_position.original_line + 1,
                    column: original_position.original_column,
                }),
                source: mapping.original.map(|o| o.source),
                name: mapping.original.and_then(|o| o.name),
            })
            .collect()
    }

    #[napi]
    pub fn to_buffer(&self) -> Result<Buffer> {
        let mut buffer_data = AlignedVec::new();
        self.0.to_buffer(&mut buffer_data)?;
        Ok(buffer_data.into_vec().into())
    }

    #[napi]
    pub fn add_source_map(
        &mut self,
        previous_map_instance: &mut JsSourceMap,
        line_offset: i64,
    ) -> Result<()> {
        self.0
            .add_sourcemap(&mut previous_map_instance.0, line_offset)?;
        Ok(())
    }

    #[napi(js_name = "addVLQMap")]
    pub fn add_vlq_map(
        &mut self,
        vlq_mappings: String,
        js_sources_arr_input: String,
        js_sources_content_arr_input: String,
        js_names_arr_input: String,
        line_offset: i64,
        column_offset: i64,
    ) -> Result<()> {
        let sources: Vec<String> = from_str(js_sources_arr_input.as_str())?;
        let sources_content: Vec<String> = from_str(js_sources_content_arr_input.as_str())?;
        let names: Vec<String> = from_str(js_names_arr_input.as_str())?;

        self.0.add_vlq_map(
            vlq_mappings.as_bytes(),
            sources.iter().map(|s| s.as_str()).collect(),
            sources_content.iter().map(|s| s.as_str()).collect(),
            names.iter().map(|s| s.as_str()).collect(),
            line_offset,
            column_offset,
        )?;
        Ok(())
    }

    #[napi(js_name = "toVLQ")]
    pub fn to_vlq(&mut self, env: Env) -> Result<VlqMapping> {
        let mut vlq_output: Vec<u8> = vec![];
        self.0.write_vlq(&mut vlq_output)?;
        let vlq_string = env.create_string_latin1(vlq_output.as_slice())?;
        Ok(VlqMapping {
            sources: Array::from_ref_vec_string(&env, self.0.get_sources())?,
            mappings: vlq_string,
            sources_content: Array::from_ref_vec_string(&env, self.get_sources_content())?,
            names: Array::from_ref_vec_string(&env, self.0.get_names())?,
        })
    }

    #[napi]
    pub fn add_indexed_mappings(&mut self, mappings_arr: Int32Array) {
        let mappings_count = mappings_arr.len();

        let mut generated_line: u32 = 0; // 0
        let mut generated_column: u32 = 0; // 1
        let mut original_line: i32 = 0; // 2
        let mut original_column: i32 = 0; // 3
        let mut original_source: i32 = 0; // 4
        for (i, value) in mappings_arr.iter().enumerate().take(mappings_count) {
            let value = *value;
            match i % 6 {
                0 => {
                    generated_line = value as u32;
                }
                1 => {
                    generated_column = value as u32;
                }
                2 => {
                    original_line = value;
                }
                3 => {
                    original_column = value;
                }
                4 => {
                    original_source = value;
                }
                5 => {
                    self.0.add_mapping(
                        generated_line,
                        generated_column,
                        if original_line > -1 && original_column > -1 && original_source > -1 {
                            Some(OriginalLocation {
                                original_line: original_line as u32,
                                original_column: original_column as u32,
                                source: original_source as u32,
                                name: if value > -1 { Some(value as u32) } else { None },
                            })
                        } else {
                            None
                        },
                    );
                }
                _ => unreachable!(),
            }
        }
    }

    #[napi]
    pub fn offset_lines(&mut self, generated_line: u32, generated_line_offset: i64) -> Result<()> {
        self.0.offset_lines(generated_line, generated_line_offset)?;
        Ok(())
    }

    #[napi]
    pub fn offset_columns(
        &mut self,
        generated_line: u32,
        generated_column: u32,
        generated_column_offset: i64,
    ) -> Result<()> {
        self.0
            .offset_columns(generated_line, generated_column, generated_column_offset)?;
        Ok(())
    }

    #[napi]
    pub fn add_empty_map(
        &mut self,
        source: String,
        source_content: String,
        line_offset: i64,
    ) -> Result<()> {
        self.0
            .add_empty_map(source.as_str(), source_content.as_str(), line_offset)?;
        Ok(())
    }

    #[napi]
    pub fn extends(&mut self, previous_map_instance: &mut JsSourceMap) -> Result<()> {
        self.0.extends(&mut previous_map_instance.0)?;
        Ok(())
    }

    #[napi]
    pub fn find_closest_mapping(
        &mut self,
        generated_line: u32,
        generated_column: u32,
    ) -> Result<Option<MappingObject>> {
        Ok(self
            .0
            .find_closest_mapping(generated_line, generated_column)
            .map(|mapping| self.mapping_to_js_object(mapping)))
    }

    #[napi]
    pub fn get_project_root(&self) -> &str {
        self.0.project_root.as_str()
    }
}
