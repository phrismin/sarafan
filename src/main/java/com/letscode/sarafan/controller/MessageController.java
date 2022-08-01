package com.letscode.sarafan.controller;

import com.letscode.sarafan.exceptions.NotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("message")
public class MessageController {

    private int counter = 4;
    private List<Map<String, String>> messages = new ArrayList<>() {{
        add(new HashMap<>() {{ put("id", "1"); put("text", "First message"); }});
        add(new HashMap<>() {{ put("id", "2"); put("text", "Second message"); }});
        add(new HashMap<>() {{ put("id", "3"); put("text", "Third message"); }});
    }};

    @GetMapping
    public List<Map<String, String>> list() {
        return messages;
    }

    @GetMapping("{id}")
    public Map<String, String> getOne(@PathVariable String id) {
        return getMessage(id);
    }

    @PostMapping
    public Map<String, String> create(@RequestBody Map<String, String> message) {
        message.put("id", String.valueOf(counter++));
        messages.add(message);
        return message;
    }

    @PutMapping("{id}")
    public Map<String, String> update(@RequestBody Map<String, String> message, @PathVariable String id) {
        Map<String, String> messageFromDB = getMessage(id);

        messageFromDB.putAll(message);
        messageFromDB.put("id", id);

        return messageFromDB;
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable String id) {
        Map<String, String> deleteMessage = getMessage(id);

        messages.remove(deleteMessage);
    }

    private Map<String, String> getMessage(String id) {
        for (Map<String, String> map : messages) {
            if (map.get("id").equals(id)) {
                return map;
            }
        }

        throw new NotFoundException();
//        return messages.stream()
//                .filter(message -> message.get("id")
//                        .equals(id))
//                .findFirst()
//                .orElseThrow(NotFoundException::new);
    }
}
