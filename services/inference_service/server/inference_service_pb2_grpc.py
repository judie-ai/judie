# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

from inference_service.server import inference_service_pb2 as inference__service_dot_server_dot_inference__service__pb2


class InferenceServiceStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.GetChatResponse = channel.unary_unary(
                '/inference_service.server.InferenceService/GetChatResponse',
                request_serializer=inference__service_dot_server_dot_inference__service__pb2.Conversation.SerializeToString,
                response_deserializer=inference__service_dot_server_dot_inference__service__pb2.TutorResponse.FromString,
                )


class InferenceServiceServicer(object):
    """Missing associated documentation comment in .proto file."""

    def GetChatResponse(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_InferenceServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'GetChatResponse': grpc.unary_unary_rpc_method_handler(
                    servicer.GetChatResponse,
                    request_deserializer=inference__service_dot_server_dot_inference__service__pb2.Conversation.FromString,
                    response_serializer=inference__service_dot_server_dot_inference__service__pb2.TutorResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'inference_service.server.InferenceService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class InferenceService(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def GetChatResponse(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/inference_service.server.InferenceService/GetChatResponse',
            inference__service_dot_server_dot_inference__service__pb2.Conversation.SerializeToString,
            inference__service_dot_server_dot_inference__service__pb2.TutorResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
