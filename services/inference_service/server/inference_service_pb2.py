# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: inference_service/server/inference_service.proto
"""Generated protocol buffer code."""
from google.protobuf.internal import builder as _builder
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n0inference_service/server/inference_service.proto\x12\x18inference_service.server\"@\n\x0c\x43onversation\x12\x30\n\x04turn\x18\x01 \x03(\x0b\x32\".inference_service.server.ConvTurn\"+\n\x08\x43onvTurn\x12\x0e\n\x06sender\x18\x01 \x01(\t\x12\x0f\n\x07message\x18\x02 \x01(\t\"!\n\rTutorResponse\x12\x10\n\x08response\x18\x01 \x01(\t2x\n\x10InferenceService\x12\x64\n\x0fGetChatResponse\x12&.inference_service.server.Conversation\x1a\'.inference_service.server.TutorResponse\"\x00\x62\x06proto3')

_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, globals())
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'inference_service.server.inference_service_pb2', globals())
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _CONVERSATION._serialized_start=78
  _CONVERSATION._serialized_end=142
  _CONVTURN._serialized_start=144
  _CONVTURN._serialized_end=187
  _TUTORRESPONSE._serialized_start=189
  _TUTORRESPONSE._serialized_end=222
  _INFERENCESERVICE._serialized_start=224
  _INFERENCESERVICE._serialized_end=344
# @@protoc_insertion_point(module_scope)
