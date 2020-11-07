package chatcontact.utils

import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.PropertyAccessor
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.readValue

object JSON {

    val mapper = ObjectMapper()
    init {
//        mapper.registerModule(AfterburnerModule())
        mapper.registerModule(JavaTimeModule())
        mapper.registerModule(KotlinModule())


        mapper.enable(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES)
        mapper.enable(JsonParser.Feature.ALLOW_NON_NUMERIC_NUMBERS)
        mapper.enable(JsonParser.Feature.ALLOW_COMMENTS)
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL)
        // normal.setSerializationInclusion(JsonInclude.Include.NON_DEFAULT); // FIX FOR unicredit mobile app
        mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS)
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)

        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.NONE)
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY)
    }

    fun parse(json: String) = mapper.readTree(json)

    fun parseObject(json: String) = mapper.readTree(json) as ObjectNode

    fun anyToObject(data: Any): ObjectNode =
        if (data is ObjectNode) {
            data
        } else {
            parseObject(stringify(data))
        }

    inline fun <reified T> parse(json: String):T =
            mapper.readValue(json, T::class.java)

    inline fun <reified T> parseList(json: String):List<T> {
        val array = mapper.readTree(json) as ArrayNode
        return array.map { mapper.treeToValue(it, T::class.java) }
    }

    fun parseMap(json: String): Map<String, Any> {
        return mapper.readValue(json)
    }

    fun <T> parse(json: String, clazz: Class<T>):T =
            mapper.readValue(json, clazz)

    fun <T> parse(json: String, tr: TypeReference<T>):T =
            mapper.readValue(json, tr)

    inline fun <reified T> parse(json: JsonNode):T =
            mapper.treeToValue(json, T::class.java)

    fun <T> parse(json: JsonNode, clazz: Class<T>):T =
            mapper.treeToValue(json, clazz)

    fun <T> stringify(data: T): String =
            mapper.writeValueAsString(data)

    fun toNode(data: Any): JsonNode =
            mapper.valueToTree(data)

    fun toObject(data: Any): ObjectNode =
            mapper.valueToTree(data)

    fun objectNode() = mapper.createObjectNode()
}
